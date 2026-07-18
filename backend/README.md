# Backend Module

## Purpose

The backend provides APIs for managing locations, stories, users, media, AI
requests, and user contributions for the Hikaya platform.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database (planned):** PostgreSQL (see [database/schema-draft.md](../database/schema-draft.md))
- **AI integration:** the narrative-generation logic is designed to live in a
  separate Python microservice (see [ai/](../ai/) for the workflow and JSON
  contract owned by the AI Smart Features Team). The NestJS `AiModule`
  proxies requests to that service over HTTP.

## Project Structure

```
backend/
├── src/
│   ├── main.ts                 # app bootstrap, global prefix `api/v1`, validation, CORS
│   ├── app.module.ts           # root module wiring feature modules
│   ├── locations/              # GET /locations, GET /locations/:id
│   ├── stories/                # GET /stories/location/:locationId, GET /stories/:id
│   ├── contributions/          # POST /contributions
│   └── ai/                     # POST /ai/generate-story, POST /ai/ask-guide
│       (proxies to the external Python AI service)
├── test/
├── .env.example
└── package.json
```

Each feature folder follows the standard NestJS module pattern:
`*.module.ts`, `*.controller.ts`, `*.service.ts`, plus `dto/` and
`entities/`/`interfaces/` where relevant.

## Current Status (Sprint 1)

This is a **skeleton implementation**. Endpoints are wired and return
placeholder data - they are not yet connected to a real database or to the
AI service. This provides a clean, working structure for the team to build
on in the next sprint.

## Planned APIs

- `GET /api/v1/locations`
- `GET /api/v1/locations/:id`
- `GET /api/v1/stories/location/:locationId`
- `POST /api/v1/contributions`
- `POST /api/v1/ai/generate-story`
- `POST /api/v1/ai/ask-guide`

## Getting Started

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.

## Next Steps

- Wire up TypeORM/Prisma against the PostgreSQL schema in `database/`.
- Replace placeholder responses in each service with real persistence.
- Implement the Python AI microservice and connect it via `AI_SERVICE_URL`.
