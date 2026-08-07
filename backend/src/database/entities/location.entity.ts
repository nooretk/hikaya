/**
 * A heritage location, mirroring the `locations` table in
 * database/schema.sql.
 *
 * `id` is a readable slug ('jerusalem', 'bethlehem', 'sebastia') shared with
 * the API path, the AI-ready content frontmatter and the frontend route.
 */
export class Location {
  id: string;
  name: string;
  arabicName?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  coverImageUrl?: string;
  /** Path to the full reviewed content file, e.g. `content/oldCity.md`. */
  contentFile?: string;
  /** Path to the AI-ready summary the AI module reads. */
  aiSummaryFile?: string;
  categories: string[];
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
