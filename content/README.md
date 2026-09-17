# Content Module

Reviewed historical and cultural material for the Hikaya MVP locations. Everything the
AI module is allowed to say about a location comes from this folder — nothing else.

## Folder Layout

```
content/
├── README.md                       # this file
├── sample-locations.md             # one-paragraph overview of the 3 MVP locations
├── oldCity.md                      # full content file — Old City of Jerusalem (Arabic)
├── beth.md                         # full content file — Bethlehem (Arabic)
├── sebastia.md                     # full content file — Sebastia (Arabic)
├── ai-ready/
│   ├── old-city-jerusalem-summary.md
│   ├── bethlehem-summary.md
│   └── sebastia-summary.md
├── media/
│   └── media.json              # verified photographs, credits and licences
└── quiz/
    └── quiz.json               # comprehension questions and their sources
```

## The Four Kinds of Material in This Folder

### 1. Full content files (`*.md` in the root of `content/`)

The long-form, human-authored research files written in Arabic by the Content
Documentation Team. They carry the complete history, cultural detail, landmarks,
crafts, food, customs, oral heritage, and reference list for one location.

They are the **canonical record**. They are not sent to the AI model directly — they are
too long and too loosely structured for a prompt.

### 2. AI-ready summary files (`ai-ready/*-summary.md`)

Condensed, structured, English versions of the full files, one per location. These are
what the AI module actually loads and puts into the prompt.

Each summary has a fixed shape so the AI service can parse it:

- YAML frontmatter: `location_id`, `name`, `arabic_name`, `city`, `country`,
  `latitude`, `longitude`, `category`, `language`, `reviewed`, `source_file`,
  `last_reviewed`
- `1. Short Overview`
- `2. Key Historical Timeline`
- `3. Cultural and Religious Importance`
- `4. Main Landmarks`
- `5. Important Facts`
- `6. Religious Traditions` — *never to be presented as historical fact*
- `7. Oral Heritage and Popular Stories` — *never to be presented as historical fact*
- `8. Source Notes` — including the explicit list of gaps the AI must not fill

`location_id` must match the `id` used in `database/seed.sql` and in the backend API
(`jerusalem`, `bethlehem`, `sebastia`), because that is how the backend picks the right
summary when it calls the AI service.

### 3. Media (`media/media.json`)

No image, audio, or video files are stored in this repository. `media/media.json`
records the photographs shown in the galleries by URL, and it is the single source
of truth for them: `ai/scripts/export_seed_data.py` generates the database, backend
and frontend copies from it.

Every entry carries:

| Field | Why it is required |
|---|---|
| `subject` | What the photograph actually shows, e.g. `Damascus Gate` |
| `caption` | One sentence for the gallery |
| `era` | `modern` or `historical` — an 1880s plate and a phone photo say different things |
| `pair_role` | `cover`, or `before`/`after` for a then-and-now comparison |
| `credit`, `license`, `license_url` | These are other people's photographs, used under licences that require attribution |
| `date` | The capture date the source gives, ranges included |
| `source_url` | The Commons page, so anyone can check |

The export script refuses to build if an entry lacks a credit or a licence, if its
declared `era` contradicts its date, or if a before/after pair shows two different
subjects. Preference order for sources: Wikimedia Commons (clear licensing, stable
URLs), then official institution galleries, then anything else with its licence
recorded.

**Check the photograph before adding it.** The metadata says what a file is called,
not what it depicts; the current set was reviewed on a contact sheet, and one image
was still caught later carrying the wrong era.

### 3b. Quiz (`quiz/quiz.json`)

Comprehension questions shown after a story. Each needs `options`, an
`answer_index`, an `explanation`, and a `source_note` naming where in the reviewed
content the answer comes from — a quiz that only says "correct" is asking to be
trusted.

### 4. Source notes

Every full content file ends with a "المصادر والوسائط / Sources & Media" section that
contains:

- direct links to the reliable references the file was built from,
- the media reference table,
- **source notes**: the review status, the known gaps in the material, and any naming
  conflicts or points where sources disagree.

The same gaps are repeated in section 8 of the matching AI-ready summary, because that is
the copy the AI module reads.

## The Fact / Tradition / Oral-Heritage Separation

This is the single most important rule in this folder, and it exists to keep the AI from
turning a tradition into a historical claim.

| Category | Definition | How the AI must present it |
|---|---|---|
| **Historical facts** | Backed by academic or archaeological sources — dates, buildings, rulers, UNESCO listings. | May be simplified and rephrased. Nothing may be added. |
| **Religious traditions** | Accounts tied to belief — "according to Christian tradition", "according to Islamic belief". | Always attributed to the tradition, never stated as established fact. |
| **Oral heritage / popular stories** | Accounts passed down locally and not historically verified. | Presented as oral heritage, with a note that it is not confirmed. |

Concrete examples already handled this way:

- The Milk Grotto legend in Bethlehem — the source file states outright that it is
  religious/popular tradition, not established history.
- Solomon's Pools — popular heritage attributes them to the Prophet Solomon;
  archaeological study dates them to the Roman period. Both are recorded, clearly labelled.
- Al-Isra' wal-Mi'raj in Jerusalem — recorded under religious traditions.

## How This Folder Is Consumed

```
content/ai-ready/<location>-summary.md
        │
        ▼
ai/service/content_loader.py     parses frontmatter + sections
        │
        ▼
ai/service/story_generator.py    builds the prompt from the summary only
        │
        ▼
POST /generate-story  ← called by the NestJS backend (POST /api/v1/ai/generate-story)
```

See [`ai/api-contract.md`](../ai/api-contract.md) for the exact JSON exchanged, and
[`docs/integration-guide.md`](../docs/integration-guide.md) for the end-to-end flow.

## Adding a New Location

1. Write the full content file in `content/`, ending with the sources and media section.
2. Write the AI-ready summary in `content/ai-ready/<slug>-summary.md`, keeping the eight
   sections and the frontmatter. The timeline table becomes the location's timeline.
3. Use the same `location_id` in `database/seed.sql`.
4. Add photographs to `content/media/media.json` and questions to `content/quiz/quiz.json`.
5. Run `python3 ai/scripts/export_seed_data.py` to regenerate the three seeds — it
   validates as it goes.
6. Run `python3 ai/scripts/generate_examples.py` to produce a sample story and confirm the
   summary parses correctly.

## Sprint 2 Status

- AI-ready summaries: done for all three MVP locations.
- Source sections: rewritten in all three full content files with direct links, media
  tables, review status, and the list of known gaps.
- Fact / tradition / oral heritage: separated in both the full files and the summaries.
