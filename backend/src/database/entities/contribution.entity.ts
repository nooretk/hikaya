/**
 * A user-submitted memory or story, mirroring the `contributions` table in
 * database/schema.sql.
 *
 * Everything a visitor submits arrives as `pending_review`. Nothing is served
 * publicly until an editor approves it.
 */
export type ContributionStatus = 'pending_review' | 'approved' | 'rejected';

export class Contribution {
  id: string;
  locationId: string;
  userId?: string | null;
  categoryId?: string | null;
  title: string;
  content: string;
  contributorName?: string;
  contributorEmail?: string;
  mediaUrl?: string;
  status: ContributionStatus;
  reviewNotes?: string | null;
  reviewedAt?: Date | null;
  submittedAt: Date;
}
