# Frontend Module

The Hikaya web interface: an interactive map of documented Palestinian heritage
sites, the story each one carries, and a form for adding your own memory.

## Framework

- **React 19** with **TypeScript**
- **Vite 6** for the build
- **React Router 7** for routing
- **Tailwind CSS 4** for styling
- **Motion** (`motion/react`) for page transitions and reveals, honouring `prefers-reduced-motion`
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
| `/` | Home | Hero with an "Ask Hikaya" call to action, the story of the day, location cards with counts, exploration progress, and a walking-tour offer |
| `/map` | Interactive map | Markers from `GET /locations`, category filters, legend, visited marks |
| `/locations/:id` | Location details | Tabs: Story, Ask, Timeline, Gallery, Quiz, Memories — plus related places |
| `/constellation` | Connections | The archive drawn as a web of shared themes and attached memories |
| `/contribute` | Contribution wizard | Four steps, a reference code, and a status lookup; `?location=<slug>` preselects a site |
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
| Story of the day / Surprise me | `GET /api/v1/stories/featured`, `/stories/random` |
| Location details | `GET /api/v1/locations/:id` |
| Reviewed stories | `GET /api/v1/stories/:locationId` |
| Timeline tab | `GET /api/v1/locations/:id/timeline` |
| Gallery tab | `GET /api/v1/locations/:id/media`, `/before-after` |
| Quiz tab | `GET /api/v1/locations/:id/quiz` |
| Related places | `GET /api/v1/locations/:id/related` |
| Published memories | `GET /api/v1/contributions?locationId=` |
| Story wizard | `POST /api/v1/ai/generate-story` |
| Heritage guide | `POST /api/v1/ai/ask-guide` |
| Contribution wizard | `POST /api/v1/contributions` |
| Status lookup | `GET /api/v1/contributions/status/:code` |

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
  saved would be worse than an error. The status lookup does not fall back either.
- **The offline guide answers nothing.** Without the API there is no reviewed content
  to search, so it says so rather than producing something plausible.

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
│   ├── motion.tsx              # PageTransition, Reveal, Stagger - all reduced-motion aware
│   ├── Skeleton.tsx            # loading placeholders shaped like their content
│   ├── MvpLocationMap.tsx      # map driven by API data, with filters and legend
│   ├── LocationCard.tsx        # with story/photo/timeline/memory counts
│   ├── FeaturedStoryCard.tsx   # story of the day
│   ├── CoverImage.tsx          # hides itself if the photo fails to load
│   ├── Tabs.tsx                # roving-tabindex tab bar
│   ├── HistoricalTimeline.tsx  # flags tradition-based entries
│   ├── Gallery.tsx             # lightbox, keyboard control, per-image credit
│   ├── BeforeAfterSlider.tsx   # only where a real pair exists
│   ├── StoryWizard.tsx         # Audience -> Style -> Generate
│   ├── NarrativeReader.tsx     # typing reveal + read-aloud with word highlight
│   ├── TransparencyPanel.tsx   # source file, generator, and the gaps
│   ├── HeritageChat.tsx        # per-location guide, with the "we don't know" invitation
│   ├── HeritageQuiz.tsx        # questions that cite their sources
│   ├── ContributionWizard.tsx  # four steps, reference code
│   ├── ContributionStatusLookup.tsx
│   ├── ProgressTracker.tsx     # visited locations and badges
│   ├── WalkingTour.tsx         # geolocation, computed in the browser
│   ├── MemoryConstellation.tsx
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
│   ├── ConstellationPage.tsx
│   ├── AboutPage.tsx
│   └── ExplorerPage.tsx
├── services/api.ts             # API client, fallback, error handling
├── hooks/
│   ├── useLocations.ts
│   ├── useVisitedLocations.ts  # localStorage tracker + badges
│   └── useNarration.ts         # speech synthesis with word boundaries
├── mocks/
│   ├── mockApiData.ts
│   └── generatedMockData.ts    # GENERATED from content/ - do not edit
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

Motion is decoration: every animation checks `prefers-reduced-motion` and collapses to a
plain fade or nothing at all. Skeletons mirror the shape of the content they stand in
for, so the page does not jump when data lands.

`src/mocks/generatedMockData.ts` is generated from the content files by
`ai/scripts/export_seed_data.py` — the same script that produces the database and
backend seeds, so the offline timeline, gallery and quiz cannot drift from the real
ones.

## Related

- [`backend/README.md`](../backend/README.md) — the API this app consumes
- [`ai/README.md`](../ai/README.md) — how the stories are generated
- [`docs/integration-guide.md`](../docs/integration-guide.md) — the end-to-end flow
- [`docs/improvements.md`](../docs/improvements.md) — what each feature does and why
