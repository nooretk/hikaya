/**
 * Shapes returned by the Hikaya backend (`/api/v1`).
 *
 * These mirror backend/src/database/entities/* and the responses documented in
 * backend/README.md. Keep them in step when the API changes.
 */

/** Counts shown on a location card so a reader knows what is waiting inside. */
export interface LocationStats {
  storyCount: number;
  imageCount: number;
  timelineEventCount: number;
  memoryCount: number;
  readingTimeMinutes: number;
}

export interface ApiLocation {
  id: string;
  name: string;
  arabicName?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  coverImageUrl?: string;
  /** Path to the full reviewed content file, shown as the citation. */
  contentFile?: string;
  aiSummaryFile?: string;
  categories: string[];
  isPublished: boolean;
  /** Present on the list endpoint; absent when a single location is fetched. */
  stats?: LocationStats;
}

export interface ApiStory {
  id: string;
  locationId: string;
  title: string;
  summary?: string;
  simplifiedStory: string;
  audience: string;
  language: string;
  tone: string;
  source?: string;
  isAiGenerated: boolean;
  uncertaintyNotes: string[];
  status: string;
}

export interface ApiContribution {
  id: string;
  referenceCode?: string;
  locationId: string;
  title: string;
  content: string;
  contributorName?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
  status: "pending_review" | "approved" | "rejected";
  submittedAt: string;
}

/** An image in a location gallery. Credit and licence always travel with it. */
export interface ApiMedia {
  id: string;
  locationId: string;
  type: "image" | "audio" | "video" | "document";
  url: string;
  thumbUrl?: string;
  subject?: string;
  description?: string;
  era: "modern" | "historical";
  pairRole?: "cover" | "before" | "after";
  credit?: string;
  license?: string;
  licenseUrl?: string;
  capturedAt?: string;
  sourceUrl?: string;
  sortOrder: number;
}

export interface BeforeAfterResponse {
  pair: { before: ApiMedia; after: ApiMedia } | null;
  /** Why there is no pair, when there is not one. */
  reason?: string;
}

export interface ApiTimelineEvent {
  id: string;
  locationId: string;
  periodLabel: string;
  description: string;
  sortYear: number;
  sortOrder: number;
  /** Rests on religious or oral tradition rather than documented history. */
  isTradition: boolean;
  sourceFile?: string;
}

export interface ApiQuizQuestion {
  id: string;
  locationId: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** Where in the reviewed content the answer comes from. */
  sourceNote: string;
  sortOrder: number;
}

export interface FeaturedStory {
  story: ApiStory;
  location: ApiLocation | null;
  reason: "daily-rotation" | "random";
  forDate?: string;
}

export interface ContributionStatus {
  referenceCode: string;
  locationId: string;
  title: string;
  status: ApiContribution["status"];
  submittedAt: string;
  reviewedAt?: string | null;
  message: string;
  reviewNotes?: string | null;
}

/** Response from POST /api/v1/ai/generate-story. */
export interface GeneratedStory {
  title: string;
  summary: string;
  narrative: string;
  targetAudience: string;
  language: string;
  tone: string;
  wordCount: number;
  /** Gaps the AI declined to fill. Shown to the reader as a footnote. */
  uncertaintyNotes: string[];
  /** Fact-guard findings. Shown only as a review flag, never as content. */
  warnings: string[];
  source: {
    locationId?: string | null;
    locationName?: string | null;
    contentFile?: string | null;
    summaryFile?: string | null;
  };
  generatedBy: string;
  storyId?: string;
}

/** Response from POST /api/v1/ai/ask-guide. */
export interface GuideAnswer {
  answer: string;
  /** False means the records do not cover the question - not an error. */
  answeredFromSource: boolean;
  excerpts: string[];
  uncertaintyNotes: string[];
  generatedBy: string;
}

export interface ChatTurn {
  question: string;
  answer: string;
}

export interface NewContribution {
  locationId: string;
  title: string;
  content: string;
  contributorName?: string;
  contributorEmail?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
}

export interface ContributionReceipt {
  status: string;
  message: string;
  referenceCode?: string;
  contribution: ApiContribution;
}

export type AudienceMode =
  | "student"
  | "tourist"
  | "child"
  | "short"
  | "historian"
  | "general";

export type StoryTone = "neutral" | "educational" | "emotional" | "storytelling";

/** Where the data on screen came from, so the UI can be honest about it. */
export type DataSource = "backend" | "mock";

// --- Existing frontend-only shapes -------------------------------------------

export interface LocationData {
  id: string;
  name: string;
  arabicName: string;
  lat: number;
  lng: number;
  coverImage: string;
  summary: string;
  culturalImportance: string;
  historicalSummary: string;
  landmarks: string[];
}

export interface Contribution {
  id: string;
  location: string;
  title: string;
  author: string;
  narrative: string;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  date: string;
}

export interface VoiceOption {
  name: string;
  voiceName: string;
  gender: "Male" | "Female";
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
