import {
  ApiContribution,
  ApiLocation,
  ApiStory,
  AudienceMode,
  ContributionReceipt,
  DataSource,
  GeneratedStory,
  NewContribution,
} from "../types";
import {
  MOCK_CONTRIBUTIONS,
  MOCK_LOCATIONS,
  MOCK_STORIES,
  mockGeneratedStory,
} from "../mocks/mockApiData";

/**
 * Client for the Hikaya backend (`/api/v1`, see backend/README.md).
 *
 * Reads fall back to the mock data in src/mocks/ when the backend is not
 * running, so the frontend is demonstrable on its own. Every result carries a
 * `source` field, and the UI shows a banner whenever it is `"mock"` - the user
 * is never shown sample data dressed up as live data.
 *
 * Writes (submitting a contribution) never fall back. Pretending a submission
 * was saved when nothing was stored would be a lie to the contributor, so the
 * error surfaces in the form instead.
 */

const BASE_URL: string =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api/v1";

const REQUEST_TIMEOUT_MS = 8000;
/** Story generation is slower than a normal read. */
const GENERATION_TIMEOUT_MS = 45000;

export interface ApiResult<T> {
  data: T;
  source: DataSource;
  /** Why the mock data was used, when it was. */
  reason?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(readErrorMessage(body, response.status), response.status);
    }
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request to the Hikaya API timed out.");
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Could not reach the Hikaya API.",
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Nest sends `message` as a string or a string[] of validation failures. */
function readErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return message.join("; ");
    if (typeof message === "string") return message;
  }
  return `Request failed with status ${status}.`;
}

/** Runs `live`, falling back to `fallback()` when the backend is unreachable. */
async function withFallback<T>(
  live: () => Promise<T>,
  fallback: () => T,
): Promise<ApiResult<T>> {
  try {
    return { data: await live(), source: "backend" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[hikaya] backend unavailable (${reason}) - showing sample data.`);
    return { data: fallback(), source: "mock", reason };
  }
}

// --- Reads -------------------------------------------------------------------

export function getLocations(): Promise<ApiResult<ApiLocation[]>> {
  return withFallback(
    () => request<ApiLocation[]>("/locations"),
    () => MOCK_LOCATIONS,
  );
}

export async function getLocation(id: string): Promise<ApiResult<ApiLocation | null>> {
  try {
    return { data: await request<ApiLocation>(`/locations/${id}`), source: "backend" };
  } catch (error) {
    // A 404 is a real answer from a working backend, not a reason to fall back.
    if (error instanceof ApiError && error.status === 404) {
      return { data: null, source: "backend" };
    }
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[hikaya] backend unavailable (${reason}) - showing sample data.`);
    return {
      data: MOCK_LOCATIONS.find((location) => location.id === id) ?? null,
      source: "mock",
      reason,
    };
  }
}

export function getStories(locationId: string): Promise<ApiResult<ApiStory[]>> {
  return withFallback(
    () => request<ApiStory[]>(`/stories/${locationId}`),
    () => MOCK_STORIES.filter((story) => story.locationId === locationId),
  );
}

export function getContributions(
  locationId?: string,
): Promise<ApiResult<ApiContribution[]>> {
  const query = locationId ? `?locationId=${encodeURIComponent(locationId)}` : "";
  return withFallback(
    () => request<ApiContribution[]>(`/contributions${query}`),
    () =>
      locationId
        ? MOCK_CONTRIBUTIONS.filter((item) => item.locationId === locationId)
        : MOCK_CONTRIBUTIONS,
  );
}

// --- AI ----------------------------------------------------------------------

export function generateStory(
  locationId: string,
  targetAudience: AudienceMode,
  tone = "storytelling",
): Promise<ApiResult<GeneratedStory>> {
  return withFallback(
    () =>
      request<GeneratedStory>(
        "/ai/generate-story",
        {
          method: "POST",
          body: JSON.stringify({ locationId, targetAudience, tone }),
        },
        GENERATION_TIMEOUT_MS,
      ),
    () => {
      const location = MOCK_LOCATIONS.find((item) => item.id === locationId);
      if (!location) {
        throw new ApiError(`No sample content for location "${locationId}".`);
      }
      return mockGeneratedStory(location, targetAudience);
    },
  );
}

// --- Writes ------------------------------------------------------------------

/**
 * Submits a contribution. Deliberately has no mock fallback: the caller must
 * see a real failure rather than a fake receipt.
 *
 * @throws ApiError when the backend rejects the submission or is unreachable.
 */
export function submitContribution(
  contribution: NewContribution,
): Promise<ContributionReceipt> {
  return request<ContributionReceipt>("/contributions", {
    method: "POST",
    body: JSON.stringify(contribution),
  });
}

export const apiBaseUrl = BASE_URL;
