import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { Contribution } from '../database/entities/contribution.entity';
import type { ContributionsRepository } from '../database/repositories/contributions.repository';
import { CONTRIBUTIONS_REPOSITORY } from '../database/repositories/tokens';
import { LocationsService } from '../locations/locations.service';

/**
 * ContributionsService
 *
 * Accepts user-submitted memories and stories. Every submission is stored with
 * status `pending_review` - nothing a visitor sends becomes publicly readable
 * until an editor approves it. The review UI itself is future work; the status
 * column and the read paths that filter on it are in place now.
 */
@Injectable()
export class ContributionsService {
  private readonly logger = new Logger(ContributionsService.name);

  constructor(
    @Inject(CONTRIBUTIONS_REPOSITORY)
    private readonly contributions: ContributionsRepository,
    private readonly locationsService: LocationsService,
  ) {}

  /**
   * @throws NotFoundException when the location does not exist, so the form
   * gets a clear 404 rather than a foreign-key error from PostgreSQL.
   */
  async create(dto: CreateContributionDto): Promise<Contribution> {
    await this.locationsService.findOne(dto.locationId);

    const contribution = await this.contributions.create({
      locationId: dto.locationId,
      userId: null,
      categoryId: dto.categoryId ?? null,
      title: dto.title,
      content: dto.content,
      contributorName: dto.contributorName,
      contributorEmail: dto.contributorEmail,
      mediaUrl: dto.mediaUrl,
      status: 'pending_review',
    });

    this.logger.log(
      `Contribution ${contribution.id} submitted for ${dto.locationId} - awaiting review`,
    );
    return contribution;
  }

  findApprovedByLocation(locationId: string): Promise<Contribution[]> {
    return this.contributions.findApprovedByLocation(locationId);
  }

  findApproved(): Promise<Contribution[]> {
    return this.contributions.findApproved();
  }
}
