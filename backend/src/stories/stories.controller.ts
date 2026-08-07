import { Controller, Get, Param } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from '../database/entities/story.entity';

/**
 * Stories endpoints.
 *
 * GET /api/v1/stories/detail/:id             -> a single story
 * GET /api/v1/stories/location/:locationId   -> stories for a location
 * GET /api/v1/stories/:locationId            -> same, the Sprint 2 route
 *
 * Route order matters: `detail/` and `location/` are declared before the bare
 * `:locationId` parameter, otherwise Nest would match them as location slugs.
 */
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get('detail/:id')
  findOne(@Param('id') id: string): Promise<Story> {
    return this.storiesService.findOne(id);
  }

  @Get('location/:locationId')
  findByLocationExplicit(
    @Param('locationId') locationId: string,
  ): Promise<Story[]> {
    return this.storiesService.findByLocation(locationId);
  }

  @Get(':locationId')
  findByLocation(@Param('locationId') locationId: string): Promise<Story[]> {
    return this.storiesService.findByLocation(locationId);
  }
}
