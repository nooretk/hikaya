import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { Contribution } from '../database/entities/contribution.entity';

/**
 * Contributions endpoints.
 *
 * POST /api/v1/contributions               -> submit a contribution for review
 * GET  /api/v1/contributions               -> approved contributions
 * GET  /api/v1/contributions?locationId=x  -> approved contributions for one location
 */
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateContributionDto): Promise<{
    status: string;
    message: string;
    contribution: Contribution;
  }> {
    const contribution = await this.contributionsService.create(dto);
    return {
      status: 'pending_review',
      message:
        'Thank you - your contribution was received and is waiting for review before it is published.',
      contribution,
    };
  }

  @Get()
  findApproved(
    @Query('locationId') locationId?: string,
  ): Promise<Contribution[]> {
    return locationId
      ? this.contributionsService.findApprovedByLocation(locationId)
      : this.contributionsService.findApproved();
  }
}
