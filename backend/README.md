# Backend Module

REST API for Hikaya: locations, stories, user contributions, and AI story
generation.

## Framework

- **[NestJS](https://nestjs.com/) 11** (TypeScript, Node.js) — chosen in Sprint 1 from
  the FastAPI/NestJS options.
- **PostgreSQL** via [`pg`](https://node-postgres.com/) — plain SQL against the schema
  in [`database/schema.sql`](../database/schema.sql), no ORM. The SQL in the repository
  *is* the schema; there is no second definition to drift from it.
- **`class-validator`** for request validation, applied globally.
- **`@nestjs/axios`** for calls to the AI module in [`ai/`](../ai/).

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

Everything in `.env.example` is optional. With no database and no AI service the API
still starts and serves real seeded data — see [Running without
PostgreSQL](#running-without-postgresql).

To use PostgreSQL (13+):

```bash
createdb hikaya
psql -d hikaya -f ../database/schema.sql
psql -d hikaya -f ../database/seed.sql
```

then set `DATABASE_URL` in `.env`.

To use the AI module, start it in another terminal:

```bash
cd ../ai && python3 -m service.server --port 8001
```

## Run

```bash
npm run start:dev     # watch mode
npm run start         # plain
npm run build && npm run start:prod
npm test              # unit tests
```

The API is served at **`http://localhost:3000/api/v1`**.

Check what it is actually talking to:

```bash
curl -s localhost:3000/api/v1/health
```

```json
{
  "status": "ok",
  "dataSource": "postgres",
  "aiServiceUrl": "http://localhost:8001",
  "timestamp": "2026-08-02T10:00:00.000Z"
}
```

`dataSource` is `postgres` or `in-memory-seed`, so there is never any doubt about
where the data came from.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1` | API description and endpoint list |
| `GET` | `/api/v1/health` | Data source and AI service in use |
| `GET` | `/api/v1/locations` | All published locations |
| `GET` | `/api/v1/locations/:id` | One location by slug |
| `GET` | `/api/v1/stories/:locationId` | Published stories for a location |
| `GET` | `/api/v1/stories/location/:locationId` | Same, explicit form |
| `GET` | `/api/v1/stories/detail/:id` | One story by id |
| `GET` | `/api/v1/contributions` | Approved contributions (`?locationId=` to filter) |
| `POST` | `/api/v1/contributions` | Submit a contribution for review |
| `POST` | `/api/v1/ai/generate-story` | Generate a narrative from reviewed content |
| `POST` | `/api/v1/ai/ask-guide` | Ask the heritage guide a question |

Location ids are readable slugs — `jerusalem`, `bethlehem`, `sebastia` — shared with
the database, the AI-ready content files, and the frontend routes.

## Example Requests and Responses

### `GET /api/v1/locations`

```bash
curl -s localhost:3000/api/v1/locations
```

```json
[
  {
    "id": "bethlehem",
    "name": "Bethlehem",
    "arabicName": "بيت لحم",
    "city": "Bethlehem",
    "country": "Palestine",
    "latitude": 31.7054,
    "longitude": 35.2024,
    "description": "A historic Palestinian city about 10 km south of Jerusalem...",
    "coverImageUrl": "https://images.unsplash.com/photo-1590076212879-...",
    "contentFile": "content/beth.md",
    "aiSummaryFile": "content/ai-ready/bethlehem-summary.md",
    "categories": ["Cultural Heritage", "Historical Landmark", "Religious Landmark"],
    "isPublished": true
  }
]
```

Unknown slugs return `404`:

```json
{ "statusCode": 404, "message": "Location with id \"atlantis\" not found", "error": "Not Found" }
```

### `GET /api/v1/stories/jerusalem`

```json
[
  {
    "id": "story-jerusalem-walls",
    "locationId": "jerusalem",
    "title": "The City Inside the Walls",
    "summary": "A walk through the Old City of Jerusalem, from its Canaanite beginnings...",
    "simplifiedStory": "Step through Damascus Gate and you step into less than one square kilometre...",
    "audience": "general",
    "language": "en",
    "tone": "storytelling",
    "source": "content/oldCity.md",
    "isAiGenerated": false,
    "uncertaintyNotes": [],
    "status": "published"
  }
]
```

Only `published` stories are returned.

### `POST /api/v1/ai/generate-story`

```bash
curl -s -X POST localhost:3000/api/v1/ai/generate-story \
  -H 'Content-Type: application/json' \
  -d '{"locationId":"sebastia","targetAudience":"student"}'
```

| Field | Required | Notes |
|---|---|---|
| `locationId` | yes* | Location slug |
| `historicalText` | yes* | Reviewed text, when it is not yet in the repository |
| `targetAudience` | no | `student` \| `tourist` \| `child` \| `short` \| `general` |
| `tone` | no | `neutral` \| `educational` \| `emotional` \| `storytelling` |
| `language` | no | `en` |
| `maxWords` | no | 40–600 |
| `persist` | no | `false` for a throwaway preview |

\* one of the two.

```json
{
  "title": "Sebastia: a short history",
  "summary": "Sebastia is one of the most important archaeological and historical sites in Palestine.",
  "narrative": "Sebastia is one of the most important archaeological and historical sites...",
  "targetAudience": "student",
  "language": "en",
  "tone": "storytelling",
  "wordCount": 307,
  "uncertaintyNotes": [
    "Gaps the AI must not fill: exact dimensions of the colonnaded street, ..."
  ],
  "warnings": [],
  "source": {
    "locationId": "sebastia",
    "locationName": "Sebastia",
    "contentFile": "content/sebastia.md",
    "summaryFile": "content/ai-ready/sebastia-summary.md"
  },
  "generatedBy": "offline-extractive",
  "storyId": "1319827b-646b-4064-8b0e-ede9c34d6d1b"
}
```

- `uncertaintyNotes` — gaps the AI declined to fill. Safe to show the reader.
- `warnings` — fact-guard findings. For reviewers, not for the reader.
- `generatedBy` — `anthropic`, `offline-extractive`, or `backend-fallback`.
- `storyId` — the stored story, saved with status `pending_review`. **Generated stories
  are never published automatically**, so they do not appear in
  `GET /stories/:locationId` until an editor approves them.

### `POST /api/v1/contributions`

```bash
curl -s -X POST localhost:3000/api/v1/contributions \
  -H 'Content-Type: application/json' \
  -d '{
    "locationId": "bethlehem",
    "title": "Christmas in Manger Square",
    "content": "Every December my whole family walked to Manger Square after dinner...",
    "contributorName": "Test User"
  }'
```

`201 Created`:

```json
{
  "status": "pending_review",
  "message": "Thank you - your contribution was received and is waiting for review before it is published.",
  "contribution": {
    "id": "0cbc5287-...",
    "locationId": "bethlehem",
    "title": "Christmas in Manger Square",
    "status": "pending_review",
    "submittedAt": "2026-08-02T10:00:00.000Z"
  }
}
```

No account is needed. Every submission lands as `pending_review` and is invisible to
`GET /contributions` until approved. `content` must be at least 20 characters; an
unknown `locationId` returns `404`.

## Running Without PostgreSQL

At boot, `DatabaseService` probes `DATABASE_URL` once. If it is missing or unreachable,
it logs a warning and every repository falls back to an in-memory copy of
`database/seed.sql` ([`src/database/seed/seed-data.ts`](src/database/seed/seed-data.ts)).

```
WARN [DatabaseService] DATABASE_URL is not set - serving seeded in-memory data.
```

The endpoints behave identically; contributions submitted in this mode live only for
the lifetime of the process. This keeps `git clone && npm install && npm start` enough
to see the API working with real content, while the same code runs against PostgreSQL
the moment `DATABASE_URL` points at one.

The same idea covers the AI module: if the service in `ai/` is unreachable,
`/ai/generate-story` returns the stored location description and says so in
`uncertaintyNotes`, with `generatedBy: "backend-fallback"`.

## Project Structure

```
backend/src/
├── main.ts                     # bootstrap: /api/v1 prefix, CORS, global validation
├── app.module.ts               # root module
├── app.controller.ts           # GET /, GET /health
├── database/
│   ├── database.module.ts      # connects, then picks postgres or in-memory repositories
│   ├── database.service.ts     # pg pool wrapper + availability probe
│   ├── entities/               # Location, Story, Contribution
│   ├── repositories/           # one interface + two implementations each
│   └── seed/seed-data.ts       # mirror of database/seed.sql
├── locations/                  # GET /locations, /locations/:id
├── stories/                    # GET /stories/:locationId, /stories/detail/:id
├── contributions/              # POST + GET /contributions
└── ai/                         # POST /ai/generate-story, /ai/ask-guide
```

Services depend on repository *interfaces* through injection tokens, never on a
concrete implementation — which is why the same service code and the same tests cover
both data sources.

## Tests

```bash
npm test
```

21 unit tests over the in-memory repositories: seeded data is real and complete,
review status is enforced, unknown ids 404, and the AI client handles success,
service failure and error payloads.

## Related

- [`database/README.md`](../database/README.md) — schema and seed
- [`ai/api-contract.md`](../ai/api-contract.md) — the JSON this backend exchanges with the AI module
- [`docs/integration-guide.md`](../docs/integration-guide.md) — the end-to-end flow
