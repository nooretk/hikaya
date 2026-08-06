# Frontend Module

The Hikaya web interface: an interactive map of documented Palestinian heritage
sites, the story each one carries, and a form for adding your own memory.

## Framework

- **React 19** with **TypeScript**
- **Vite 6** for the build
- **React Router 7** for routing
- **Tailwind CSS 4** for styling
- **lucide-react** for icons
- **Express** (`server.ts`) as the dev/production host, which also serves the
  Gemini-backed features used by the `/explorer` page

## Installation

```bash
cd frontend
npm install
cp .env.example .env
```

Nothing in `.env` is required. Without it the app points at
`http://localhost:3000/api/v1` and falls back to bundled sample data if that is not
running.

## Run

```bash
npm run dev      # dev server with HMR, http://localhost:5173
npm run build    # production bundle into dist/
npm run start    # serve the production build
npm run lint     # tsc --noEmit
```

The dev server listens on **5173**, not 3000, so it does not collide with the
backend API. Override with `PORT` in `.env`.

For the full experience, run all three parts:

```bash
cd ai      && python3 -m service.server --port 8001   # AI module
cd backend && npm run start:dev                       # API on :3000
cd frontend&& npm run dev                             # UI on :5173
```

## Main Pages

| Route | Page | What it does |
|---|---|---|
| `/` | Home | What Hikaya is, how the flow works, and the locations in the archive |
| `/map` | Interactive map | Markers built from `GET /locations`; select one to preview, open it for the full page |
| `/locations/:id` | Location details | Facts, reviewed stories, the AI story section, and published memories |
| `/contribute` | Contribution form | Submits to `POST /contributions`; `?location=<slug>` preselects a site |
| `/about` | About | Project background |
| `/explorer` | Explorer | The Sprint 1 experience, kept intact — wider location set, Gemini narrator, video and TTS |

Route ids are the same slugs used by the API, the database and the content files
(`jerusalem`, `bethlehem`, `sebastia`), so `/locations/bethlehem` is a shareable,
readable URL.

## Integration Status

**Connected to the backend.** Every read on the MVP pages goes through
[`src/services/api.ts`](src/services/api.ts):

| Screen | Endpoint |
|---|---|
| Home, Map, Contribute | `GET /api/v1/locations` |
| Location details | `GET /api/v1/locations/:id` |
| Reviewed stories | `GET /api/v1/stories/:locationId` |
| Published memories | `GET /api/v1/contributions?locationId=` |
| "Generate story" | `POST /api/v1/ai/generate-story` |
| Contribution form | `POST /api/v1/contributions` |

### Mock data and how it is handled

Sprint 2 allows temporary mock data with the same final structure. This is
implemented, but with a rule attached: **mock data is never presented as live data.**

- [`src/mocks/mockApiData.ts`](src/mocks/mockApiData.ts) holds the same records as
  `database/seed.sql`, in the same shape as the API returns.
- Every read returns `{ data, source }` where `source` is `"backend"` or `"mock"`.
- When it is `"mock"`, the page shows a banner naming the API URL it could not reach
  and how to start it.
- A `404` from a working backend is a real answer, not a reason to fall back.
- **Writes never fall back.** If a contribution cannot be submitted, the form says so
  and warns you to copy your text. Showing a fake receipt for something that was never
  saved would be worse than an error.

So switching between mock and live changes nothing on screen except that banner.

### The `/explorer` page

The Sprint 1 explorer still calls the Gemini endpoints in `server.ts` and reads its
locations from the bundled `src/locationsData.ts`. It is intentionally left as it was —
it needs `GEMINI_API_KEY` and `GOOGLE_MAPS_PLATFORM_KEY` for the narrator, TTS, video
and satellite view. The Sprint 2 MVP flow does not need either key.

## Project Structure

```
frontend/src/
├── App.tsx                     # routes
├── components/
│   ├── AppLayout.tsx           # header, nav, footer
│   ├── MvpLocationMap.tsx      # map driven by API data
│   ├── LocationCard.tsx
│   ├── CoverImage.tsx          # hides itself if the photo fails to load
│   ├── StorySection.tsx        # reviewed stories + AI story generation
│   ├── ContributionForm.tsx
│   ├── DataSourceBanner.tsx    # "sample data" notice
│   ├── PalestineCanvasMap.tsx  # Sprint 1 explorer components below
│   ├── GoogleMapsOverlay.tsx
│   ├── StoryNarrator.tsx
│   ├── ContributionsList.tsx
│   └── AboutPanel.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── MapPage.tsx
│   ├── LocationDetailsPage.tsx
│   ├── ContributePage.tsx
│   ├── AboutPage.tsx
│   └── ExplorerPage.tsx
├── services/api.ts             # API client, fallback, error handling
├── hooks/useLocations.ts
├── mocks/mockApiData.ts
├── types.ts                    # API shapes
└── locationsData.ts            # bundled data for the explorer page
```

## Design Notes

The interface follows the Sprint 1 direction: olive and amber on warm off-white,
Playfair Display for headings, generous whitespace, and no visual noise competing with
the content.

Two things are always shown alongside an AI-generated story, because the content
workflow depends on them:

- **the source file** the facts came from, and
- **the uncertainty notes** — what the records do not cover and the AI therefore
  refused to guess at.

Fact-guard warnings, if any, are shown in a separate red block marked for review, never
mixed into the story text.

## Related

- [`backend/README.md`](../backend/README.md) — the API this app consumes
- [`ai/README.md`](../ai/README.md) — how the stories are generated
- [`docs/integration-guide.md`](../docs/integration-guide.md) — the end-to-end flow
