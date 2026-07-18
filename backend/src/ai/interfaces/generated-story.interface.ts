/**
 * Placeholder shape for an AI-generated narrative response, mirroring
 * the AI-backend JSON contract (see ai/ folder for the full spec
 * owned by the AI Smart Features Team).
 */
export interface GeneratedStory {
  title: string;
  summary: string;
  narrative: string;
  warnings?: string[];
}
