-- =============================================================================
-- Hikaya - PostgreSQL schema
-- =============================================================================
-- Sprint 2 implementation of database/schema-draft.md.
--
-- Requires PostgreSQL 13 or newer (uses the built-in gen_random_uuid()).
--
-- Usage:
--   createdb hikaya
--   psql -d hikaya -f database/schema.sql
--   psql -d hikaya -f database/seed.sql
--
-- The script is idempotent: it drops and recreates the MVP tables, so running
-- it again resets the schema. Do not run it against a database that holds real
-- user contributions.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Clean slate (child tables first because of the foreign keys)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS location_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- -----------------------------------------------------------------------------
-- Shared trigger function: keep updated_at honest
-- -----------------------------------------------------------------------------
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
-- Platform accounts. In the MVP only editors/admins actually sign in; visitors
-- may submit a contribution without an account, in which case
-- contributions.user_id stays NULL and the free-text contributor fields are used.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT,
  role          TEXT        NOT NULL DEFAULT 'visitor'
                            CHECK (role IN ('visitor', 'contributor', 'editor', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- locations
-- -----------------------------------------------------------------------------
-- The primary key is a human-readable slug ('jerusalem', 'bethlehem',
-- 'sebastia'). The same slug is used by:
--   * the API path            GET /api/v1/locations/jerusalem
--   * the AI-ready content     content/ai-ready/*.md  (location_id in frontmatter)
--   * the frontend route       /locations/jerusalem
-- Keeping one identifier across all three layers is what makes the integration
-- flow work without a translation table.
-- -----------------------------------------------------------------------------
CREATE TABLE locations (
  id              TEXT         PRIMARY KEY,
  name            TEXT         NOT NULL,
  arabic_name     TEXT,
  city            TEXT,
  country         TEXT         NOT NULL DEFAULT 'Palestine',
  latitude        NUMERIC(9,6),
  longitude       NUMERIC(9,6),
  description     TEXT,
  cover_image_url TEXT,
  -- Where the reviewed material for this location lives in the repository.
  content_file    TEXT,        -- e.g. content/oldCity.md
  ai_summary_file TEXT,        -- e.g. content/ai-ready/old-city-jerusalem-summary.md
  is_published    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT locations_latitude_range  CHECK (latitude  IS NULL OR latitude  BETWEEN -90  AND 90),
  CONSTRAINT locations_longitude_range CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE INDEX locations_city_idx      ON locations (city);
CREATE INDEX locations_published_idx ON locations (is_published);

CREATE TRIGGER locations_set_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- categories  (content categories)
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- location_categories  (many-to-many between locations and categories)
-- -----------------------------------------------------------------------------
CREATE TABLE location_categories (
  location_id TEXT NOT NULL REFERENCES locations (id)  ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  PRIMARY KEY (location_id, category_id)
);

CREATE INDEX location_categories_category_idx ON location_categories (category_id);

-- -----------------------------------------------------------------------------
-- stories
-- -----------------------------------------------------------------------------
-- Holds both editor-written narratives and AI-generated ones.
--   original_content   the reviewed source text the story was built from
--   simplified_story   the narrative shown to the user
--   uncertainty_notes  gaps the AI flagged instead of inventing facts
-- Only rows with status = 'published' are served to the public API.
-- -----------------------------------------------------------------------------
CREATE TABLE stories (
  id                TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  location_id       TEXT        NOT NULL REFERENCES locations (id) ON DELETE CASCADE,
  author_id         TEXT        REFERENCES users (id) ON DELETE SET NULL,
  title             TEXT        NOT NULL,
  summary           TEXT,
  original_content  TEXT,
  simplified_story  TEXT        NOT NULL,
  audience          TEXT        NOT NULL DEFAULT 'general'
                                CHECK (audience IN ('child', 'student', 'tourist', 'general', 'short')),
  language          TEXT        NOT NULL DEFAULT 'en',
  tone              TEXT        NOT NULL DEFAULT 'storytelling'
                                CHECK (tone IN ('neutral', 'educational', 'emotional', 'storytelling')),
  source            TEXT,
  is_ai_generated   BOOLEAN     NOT NULL DEFAULT FALSE,
  uncertainty_notes TEXT[]      NOT NULL DEFAULT '{}',
  status            TEXT        NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'pending_review', 'published', 'rejected')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX stories_location_idx        ON stories (location_id);
CREATE INDEX stories_status_idx          ON stories (status);
CREATE INDEX stories_location_status_idx ON stories (location_id, status);

CREATE TRIGGER stories_set_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- media  (media metadata - the files themselves are never stored in this repo)
-- -----------------------------------------------------------------------------
CREATE TABLE media (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  location_id TEXT        NOT NULL REFERENCES locations (id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('image', 'audio', 'video', 'document')),
  url         TEXT        NOT NULL,
  description TEXT,
  license     TEXT,       -- recorded for every asset, see content/README.md
  source_url  TEXT,       -- page the asset was taken from
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX media_location_idx ON media (location_id);
CREATE INDEX media_type_idx     ON media (type);

-- -----------------------------------------------------------------------------
-- contributions
-- -----------------------------------------------------------------------------
-- User-submitted memories and stories. Everything lands as 'pending_review';
-- nothing a visitor submits is served publicly until an editor approves it.
-- user_id is NULL for anonymous submissions from the public contribution form.
-- -----------------------------------------------------------------------------
CREATE TABLE contributions (
  id                TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  location_id       TEXT        NOT NULL REFERENCES locations (id) ON DELETE CASCADE,
  user_id           TEXT        REFERENCES users (id) ON DELETE SET NULL,
  category_id       TEXT        REFERENCES categories (id) ON DELETE SET NULL,
  title             TEXT        NOT NULL,
  content           TEXT        NOT NULL,
  contributor_name  TEXT,
  contributor_email TEXT,
  media_url         TEXT,
  status            TEXT        NOT NULL DEFAULT 'pending_review'
                                CHECK (status IN ('pending_review', 'approved', 'rejected')),
  review_notes      TEXT,
  reviewed_at       TIMESTAMPTZ,
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contributions_location_idx ON contributions (location_id);
CREATE INDEX contributions_status_idx   ON contributions (status);

COMMIT;
