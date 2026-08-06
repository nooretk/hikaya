import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { InMemoryStoriesRepository } from '../database/repositories/stories.repository';
import { STORIES_REPOSITORY } from '../database/repositories/tokens';

describe('StoriesService', () => {
  let service: StoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoriesService,
        { provide: STORIES_REPOSITORY, useClass: InMemoryStoriesRepository },
      ],
    }).compile();

    service = module.get(StoriesService);
  });

  it('returns the seeded story for each MVP location', async () => {
    for (const locationId of ['jerusalem', 'bethlehem', 'sebastia']) {
      const stories = await service.findByLocation(locationId);
      expect(stories).toHaveLength(1);
      expect(stories[0].simplifiedStory.length).toBeGreaterThan(200);
      expect(stories[0].status).toBe('published');
    }
  });

  it('returns nothing for a location with no stories', async () => {
    expect(await service.findByLocation('atlantis')).toEqual([]);
  });

  it('throws 404 for an unknown story id', async () => {
    await expect(service.findOne('no-such-story')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('keeps newly created stories out of the published results', async () => {
    const created = await service.create({
      locationId: 'jerusalem',
      authorId: null,
      title: 'Generated story',
      summary: 'A generated summary.',
      simplifiedStory: 'A generated narrative.',
      audience: 'student',
      language: 'en',
      tone: 'storytelling',
      isAiGenerated: true,
      uncertaintyNotes: ['a gap the source did not cover'],
      status: 'pending_review',
    });

    expect(created.id).toBeTruthy();
    expect(await service.findOne(created.id)).toMatchObject({
      status: 'pending_review',
      isAiGenerated: true,
    });

    const published = await service.findByLocation('jerusalem');
    expect(published.map((story) => story.id)).not.toContain(created.id);
  });
});
