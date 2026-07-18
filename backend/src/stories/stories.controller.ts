import { Controller, Get, Param } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from './entities/story.entity';

/**
 * Stories endpoints (MVP skeleton).
 *
 * GET /api/v1/stories/location/:locationId -> stories generated for a location
 * GET /api/v1/stories/:id                  -> a single story by id
 */
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get('location/:locationId')
  findByLocation(@Param('locationId') locationId: string): Promise<Story[]> {
    return this.storiesService.findByLocation(locationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Story> {
    return this.storiesService.findOne(id);
  }
}
