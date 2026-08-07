# Database Module

PostgreSQL implementation of the Hikaya data model.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | The PostgreSQL implementation — tables, keys, constraints, indexes, triggers. Run this first. |
| `seed.sql` | Seed data for the three MVP locations. Run this second. |
| `schema-draft.md` | The Sprint 1 design draft that `schema.sql` implements. Kept for reference. |
| `HikayaSchema.png` | ER diagram of the draft. |

## Requirements

PostgreSQL **13 or newer** — `schema.sql` uses the built-in `gen_random_uuid()`.

## Setup

```bash
createdb hikaya
psql -d hikaya -f database/schema.sql
psql -d hikaya -f database/seed.sql
```

Then point the backend at it in `backend/.env`:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/hikaya
```

Both scripts are re-runnable. `schema.sql` drops and recreates the MVP tables, so
running it again resets everything — do not run it against a database holding real
user contributions.

Verify the seed:

```bash
psql -d hikaya -c "SELECT id, name, city FROM locations ORDER BY id;"
```

## Tables

| Table | Holds |
|---|---|
| `users` | Platform accounts. Only editors/admins sign in during the MVP. |
| `locations` | The heritage sites shown on the map. |
| `categories` | Content categories (historical, religious, archaeological, cultural). |
| `location_categories` | Many-to-many join between locations and categories. |
| `stories` | Narratives for a location — editor-written or AI-generated. |
| `media` | Media *metadata*. No media files are stored in this repository. |
| `contributions` | User-submitted memories, awaiting review. |

### Relationships

```
users ──< stories >── locations ──< media
  │                       │
  └──< contributions >────┘
                          │
locations >──< location_categories >──< categories
                          │
              contributions >── categories
```

- One user can author many stories and submit many contributions.
- One location can have many stories, many media items, and many contributions.
- A location can belong to several categories, and a category can hold several locations.

### Slug primary keys on `locations`

`locations.id` is a human-readable slug — `jerusalem`, `bethlehem`, `sebastia` — not a
UUID. The same slug is used in three other places:

- the API path: `GET /api/v1/locations/jerusalem`
- the AI-ready content frontmatter: `location_id: jerusalem` in
  `content/ai-ready/old-city-jerusalem-summary.md`
- the frontend route: `/locations/jerusalem`

One identifier across all layers is what lets the backend find the right content file
for a location when it calls the AI service, with no lookup table in between. Every
other table uses generated ids (`gen_random_uuid()::text`), except the seeded rows,
which use readable ids so the seed file is easy to follow.

### Review status is enforced in the schema

- `stories.status` — `draft` | `pending_review` | `published` | `rejected`.
  The public API only serves `published`.
- `contributions.status` — `pending_review` | `approved` | `rejected`, defaulting to
  `pending_review`. Nothing a visitor submits becomes public without an editor.
- `stories.uncertainty_notes` is a `TEXT[]` holding the gaps the AI flagged rather than
  filling. It is stored with the story so a reviewer can see what the model refused to
  guess at.

## Seed Contents

- **3 locations** — Old City of Jerusalem, Bethlehem, Sebastia, each with name, Arabic
  name, city, coordinates, description, cover image, category links, and pointers to
  its content file and AI-ready summary.
- **4 categories** and their location links.
- **3 published stories**, one per location, written from the reviewed summaries.
- **7 media records** — Wikimedia Commons categories and UNESCO entries, each with its
  licence recorded.
- **2 approved sample contributions** so the memories view is not empty on a fresh install.
- **2 editor users** with `password_hash` left NULL — no credentials are committed.

All seeded facts come from `content/` and `content/ai-ready/`.

## Running Without PostgreSQL

The backend does not require a database to start. If `DATABASE_URL` is unset or the
server is unreachable, it logs a warning and falls back to an in-memory repository
seeded with the same data as `seed.sql` (`backend/src/database/seed/seed-data.ts`), so
every endpoint still returns real seeded content. See
[`backend/README.md`](../backend/README.md).

Keep `seed-data.ts` and `seed.sql` in step when either changes.
