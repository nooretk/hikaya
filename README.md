# Hikaya – AI-Powered Platform for Preserving Palestinian Memory and Heritage

Hikaya is an interactive storytelling platform for Palestinian memory, culture, oral
history and heritage. Explore documented locations on a map, read the story behind
each one, ask for it to be retold for a student, a visitor or a child, and add the
memories you carry yourself.

The stories are built **only** from reviewed content. When the records do not cover
something, Hikaya says so instead of filling the gap.

---

## Quick Start

Three terminals, and no API keys required:

```bash
# AI module — no dependencies needed
cd ai && python3 -m service.server --port 8001

# Backend — runs with or without PostgreSQL
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev
```

Then open <http://localhost:5173>.

With PostgreSQL (optional, recommended):

```bash
createdb hikaya
psql -d hikaya -f database/schema.sql
psql -d hikaya -f database/seed.sql
psql -d hikaya -f database/seed-generated.sql
echo 'DATABASE_URL=postgresql://user:password@localhost:5432/hikaya' >> backend/.env
```

Full setup and troubleshooting: [`docs/integration-guide.md`](docs/integration-guide.md).

---

## Repository Layout

| Folder | Contents |
|---|---|
| [`frontend/`](frontend/) | React + Vite web interface |
| [`backend/`](backend/) | NestJS REST API |
| [`database/`](database/) | PostgreSQL schema and seed data |
| [`ai/`](ai/) | Story generation module and the backend JSON contract |
| [`content/`](content/) | Reviewed heritage content and AI-ready summaries |
| [`docs/`](docs/) | Architecture, integration guide and sprint reports |

Each folder has its own README.

---

## Features

- Interactive map with category filters, a legend, and your visited sites marked
- A location page per site: story, guide, historical timeline, photograph
  gallery, quiz, and the memories people have contributed
- AI-generated stories in student, tourist, child, historian and short modes,
  chosen through an Audience → Style → Generate flow
- Read-aloud narration that highlights the word being spoken
- An AI Heritage Guide that answers from reviewed content only, keeps the thread
  of a conversation, and says when it does not know
- A then-and-now slider where the archive holds a matching historical photograph
- Contribution wizard with a reference code, so an anonymous contributor can
  check what happened to their memory
- A heritage quiz whose answers cite where in the content they come from
- The archive drawn as a constellation of shared themes and attached memories
- Reviewed heritage content for three locations: the Old City of Jerusalem,
  Bethlehem and Sebastia

## Technology

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 6, React Router 7, Tailwind CSS 4 |
| Backend | NestJS 11 (TypeScript), `pg` |
| Database | PostgreSQL 13+ |
| AI module | Python 3.8+, FastAPI (optional), Anthropic API (optional) |

---

## The Rule That Shapes the Design

The AI never invents historical facts. It simplifies, rewrites and summarises reviewed
content, and nothing else.

That is enforced, not just stated:

- Content enters only through `content/ai-ready/`. A location with no reviewed summary
  gets a refusal, not a story from general knowledge.
- Religious traditions and oral heritage are stored separately from documented facts
  and must always be attributed.
- Generated text is checked for numbers and proper nouns that do not appear in the
  source; anything unmatched is flagged for a human.
- Gaps come back as uncertainty notes shown next to the story.
- Generated stories and user contributions both land in a review queue. Neither
  reaches a reader without an editor.
- Photographs are real pictures of the actual sites, each shown with its
  photographer and licence. A then-and-now comparison is only offered where the
  archive holds two photographs of the *same* subject.

---

## Current Status

The first integrated prototype works end to end: the frontend reads live data from the
backend, the backend reads PostgreSQL, and story generation runs through the AI module
against the reviewed content files.

Each part also runs alone, and says so when it does — the backend falls back to seeded
in-memory data, the AI module to an offline generator that only reuses source
sentences, the frontend to bundled sample data behind a visible banner. No fallback
pretends to be the real thing.

What is not built yet: the editor review interface, Arabic output, authentication, and
media upload. See [`docs/sprint-2-report.md`](docs/sprint-2-report.md) for the Sprint 2
account and [`docs/improvements.md`](docs/improvements.md) for what each feature does,
what was deliberately done differently from the brief, and why.

---

## Team

Team Beta — Aws Hammad (PM), Noureddin Etkaidek, Doaa Hatu, Amra Sawalha,
Hussein Jaradat, Arwa Al-Hajahja, Tamara Hamdan.
