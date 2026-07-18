import { Injectable } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';

/**
 * ContributionsService
 *
 * Skeleton service for accepting user-submitted contributions
 * (memories, stories, media references) tied to a location.
 * TODO: persist to the `contributions`/`stories` tables once the
 * database layer is implemented, and add a moderation/review step
 * before content is published.
 */
@Injectable()
export class ContributionsService {
  create(
    dto: CreateContributionDto,
  ): Promise<{ id: string } & CreateContributionDto> {
    // TODO: save to the database and return the persisted record
    return Promise.resolve({ id: 'placeholder-id', ...dto });
  }
}
