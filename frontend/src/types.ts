/**
 * Shapes returned by the Hikaya backend (`/api/v1`).
 *
 * These mirror backend/src/database/entities/* and the responses documented in
 * backend/README.md. Keep them in step when the API changes.
 */

export interface ApiLocation {
  id: string;
  name: string;
  arabicName?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  coverImageUrl?: string;
  /** Path to the full reviewed content file, shown as the citation. */
  contentFile?: string;
  aiSummaryFile?: string;
  categories: string[];
  isPublished: boolean;
}

export interface ApiStory {
  id: string;
  locationId: string;
  title: string;
  summary?: string;
  simplifiedStory: string;
  audience: string;
  language: string;
  tone: string;
  source?: string;
  isAiGenerated: boolean;
  uncertaintyNotes: string[];
  status: string;
}

export interface ApiContribution {
  id: string;
  locationId: string;
  title: string;
  content: string;
  contributorName?: string;
  mediaUrl?: string;
  status: "pending_review" | "approved" | "rejected";
  submittedAt: string;
}

/** Response from POST /api/v1/ai/generate-story. */
export interface GeneratedStory {
  title: string;
  summary: string;
  narrative: string;
  targetAudience: string;
  language: string;
  tone: string;
  wordCount: number;
  /** Gaps the AI declined to fill. Shown to the reader as a footnote. */
  uncertaintyNotes: string[];
  /** Fact-guard findings. Shown only as a review flag, never as content. */
  warnings: string[];
  source: {
    locationId?: string | null;
    locationName?: string | null;
    contentFile?: string | null;
    summaryFile?: string | null;
  };
  generatedBy: string;
  storyId?: string;
}

export interface NewContribution {
  locationId: string;
  title: string;
  content: string;
  contributorName?: string;
  contributorEmail?: string;
  mediaUrl?: string;
}

export interface ContributionReceipt {
  status: string;
  message: string;
  contribution: ApiContribution;
}

export type AudienceMode = "student" | "tourist" | "child" | "short" | "general";

/** Where the data on screen came from, so the UI can be honest about it. */
export type DataSource = "backend" | "mock";

// --- Existing frontend-only shapes -------------------------------------------

export interface LocationData {
  id: string;
  name: string;
  arabicName: string;
  lat: number;
  lng: number;
  coverImage: string;
  summary: string;
  culturalImportance: string;
  historicalSummary: string;
  landmarks: string[];
}

export interface Contribution {
  id: string;
  location: string;
  title: string;
  author: string;
  narrative: string;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  date: string;
}

export interface VoiceOption {
  name: string;
  voiceName: string;
  gender: "Male" | "Female";
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
