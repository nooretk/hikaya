import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Story } from './entities/story.entity';

/**
 * StoriesService
 *
 * Skeleton service for retrieving AI-generated narratives tied to a
 * location. TODO: replace with real persistence (`stories` table,
 * see database/schema-draft.md) and a real call into the AI module
 * once the narrative generation workflow (see ai/ folder) is wired in.
 */
@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);

  findByLocation(locationId: string): Promise<Story[]> {
    // TODO: fetch generated/stored stories for this location
    this.logger.debug(`findByLocation called with locationId: ${locationId}`);
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<Story> {
    // TODO: fetch a single story by id
    return Promise.reject(
      new NotFoundException(`Story with id "${id}" not found`),
    );
  }
}
