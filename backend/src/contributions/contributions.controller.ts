import { Body, Controller, Post } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

/**
 * Contributions endpoints (MVP skeleton).
 *
 * POST /api/v1/contributions -> submit a user contribution for a location
 */
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionsService.create(dto);
  }
}
