import { randomUUID } from 'crypto';
import {
  Contribution,
  ContributionStatus,
} from '../entities/contribution.entity';
import { DatabaseService } from '../database.service';
import { SEED_CONTRIBUTIONS } from '../seed/seed-data';

export type NewContribution = Omit<
  Contribution,
  'id' | 'submittedAt' | 'reviewedAt' | 'reviewNotes'
>;

export interface ContributionsRepository {
  create(contribution: NewContribution): Promise<Contribution>;
  /** Approved contributions only - pending submissions are never public. */
  findApprovedByLocation(locationId: string): Promise<Contribution[]>;
  findApproved(): Promise<Contribution[]>;
}

interface ContributionRow {
  id: string;
  location_id: string;
  user_id: string | null;
  category_id: string | null;
  title: string;
  content: string;
  contributor_name: string | null;
  contributor_email: string | null;
  media_url: string | null;
  status: ContributionStatus;
  review_notes: string | null;
  reviewed_at: Date | null;
  submitted_at: Date;
}

function toContribution(row: ContributionRow): Contribution {
  return {
    id: row.id,
    locationId: row.location_id,
    userId: row.user_id,
    categoryId: row.category_id,
    title: row.title,
    content: row.content,
    contributorName: row.contributor_name ?? undefined,
    contributorEmail: row.contributor_email ?? undefined,
    mediaUrl: row.media_url ?? undefined,
    status: row.status,
    reviewNotes: row.review_notes,
    reviewedAt: row.reviewed_at,
    submittedAt: row.submitted_at,
  };
}

export class PostgresContributionsRepository implements ContributionsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(contribution: NewContribution): Promise<Contribution> {
    const result = await this.db.query<ContributionRow>(
      `INSERT INTO contributions
         (location_id, user_id, category_id, title, content,
          contributor_name, contributor_email, media_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        contribution.locationId,
        contribution.userId ?? null,
        contribution.categoryId ?? null,
        contribution.title,
        contribution.content,
        contribution.contributorName ?? null,
        contribution.contributorEmail ?? null,
        contribution.mediaUrl ?? null,
        contribution.status,
      ],
    );
    return toContribution(result.rows[0]);
  }

  async findApprovedByLocation(locationId: string): Promise<Contribution[]> {
    const result = await this.db.query<ContributionRow>(
      `SELECT * FROM contributions
       WHERE location_id = $1 AND status = 'approved'
       ORDER BY submitted_at DESC`,
      [locationId],
    );
    return result.rows.map(toContribution);
  }

  async findApproved(): Promise<Contribution[]> {
    const result = await this.db.query<ContributionRow>(
      `SELECT * FROM contributions
       WHERE status = 'approved'
       ORDER BY submitted_at DESC`,
    );
    return result.rows.map(toContribution);
  }
}

/**
 * Serves database/seed.sql from memory when PostgreSQL is not configured.
 *
 * Submissions accumulate for the lifetime of the process only. That is fine for
 * the MVP demo, and the warning in DatabaseService makes it clear which mode is
 * running.
 */
export class InMemoryContributionsRepository implements ContributionsRepository {
  private readonly contributions: Contribution[] = SEED_CONTRIBUTIONS.map(
    (item) => ({
      ...item,
    }),
  );

  create(contribution: NewContribution): Promise<Contribution> {
    const created: Contribution = {
      ...contribution,
      id: randomUUID(),
      reviewNotes: null,
      reviewedAt: null,
      submittedAt: new Date(),
    };
    this.contributions.unshift(created);
    return Promise.resolve(created);
  }

  findApprovedByLocation(locationId: string): Promise<Contribution[]> {
    return Promise.resolve(
      this.contributions.filter(
        (item) => item.locationId === locationId && item.status === 'approved',
      ),
    );
  }

  findApproved(): Promise<Contribution[]> {
    return Promise.resolve(
      this.contributions.filter((item) => item.status === 'approved'),
    );
  }
}
