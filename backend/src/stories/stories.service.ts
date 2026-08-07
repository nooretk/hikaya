import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Story } from '../database/entities/story.entity';
import type {
  NewStory,
  StoriesRepository,
} from '../database/repositories/stories.repository';
import { STORIES_REPOSITORY } from '../database/repositories/tokens';

/**
 * StoriesService
 *
 * Reads the narratives attached to a location. Only published stories are
 * served; AI-generated ones are created with status `pending_review` and stay
 * out of these results until an editor approves them.
 */
@Injectable()
export class StoriesService {
  constructor(
    @Inject(STORIES_REPOSITORY)
    private readonly stories: StoriesRepository,
  ) {}

  findByLocation(locationId: string): Promise<Story[]> {
    return this.stories.findByLocation(locationId);
  }

  async findOne(id: string): Promise<Story> {
    const story = await this.stories.findById(id);
    if (!story) {
      throw new NotFoundException(`Story with id "${id}" not found`);
    }
    return story;
  }

  create(story: NewStory): Promise<Story> {
    return this.stories.create(story);
  }
}
