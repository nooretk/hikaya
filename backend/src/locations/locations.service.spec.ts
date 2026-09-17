import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { IN_MEMORY_REPOSITORY_PROVIDERS } from '../testing/in-memory-providers';

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService, ...IN_MEMORY_REPOSITORY_PROVIDERS],
    }).compile();

    service = module.get(LocationsService);
  });

  it('returns the three seeded MVP locations', async () => {
    const locations = await service.findAll();
    expect(locations.map((location) => location.id).sort()).toEqual([
      'bethlehem',
      'jerusalem',
      'sebastia',
    ]);
  });

  it('returns real seeded data, not placeholders', async () => {
    const jerusalem = await service.findOne('jerusalem');
    expect(jerusalem.name).toBe('Old City of Jerusalem');
    expect(jerusalem.latitude).toBeCloseTo(31.778);
    expect(jerusalem.longitude).toBeCloseTo(35.2354);
    expect(jerusalem.description).toContain('UNESCO');
    expect(jerusalem.categories.length).toBeGreaterThan(0);
  });

  it('points every location at its reviewed content files', async () => {
    for (const location of await service.findAll()) {
      expect(location.contentFile).toMatch(/^content\//);
      expect(location.aiSummaryFile).toMatch(/^content\/ai-ready\//);
    }
  });

  it('throws 404 for an unknown location', async () => {
    await expect(service.findOne('atlantis')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  describe('summary counts', () => {
    it('reports stories, images, timeline entries and memories per location', async () => {
      const locations = await service.findAllWithStats();
      const jerusalem = locations.find(
        (location) => location.id === 'jerusalem',
      );

      expect(jerusalem?.stats.storyCount).toBe(1);
      expect(jerusalem?.stats.imageCount).toBeGreaterThan(0);
      expect(jerusalem?.stats.timelineEventCount).toBeGreaterThan(0);
      expect(jerusalem?.stats.memoryCount).toBe(1);
    });

    it('estimates a reading time of at least a minute where there is a story', async () => {
      for (const location of await service.findAllWithStats()) {
        expect(location.stats.readingTimeMinutes).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('media', () => {
    it('returns gallery images carrying credit and licence', async () => {
      const media = await service.findMedia('sebastia');
      expect(media.length).toBeGreaterThan(0);
      for (const item of media) {
        expect(item.credit).toBeTruthy();
        expect(item.license).toBeTruthy();
        expect(item.sourceUrl).toContain('commons.wikimedia.org');
      }
    });

    it('pairs a historical and a present-day photo of the same subject', async () => {
      const pair = await service.findBeforeAfter('jerusalem');
      expect(pair).not.toBeNull();
      expect(pair?.before.era).toBe('historical');
      expect(pair?.after.era).toBe('modern');
      expect(pair?.before.subject).toBe(pair?.after.subject);
    });

    it('returns no pair where there is no matching historical photo', async () => {
      // Sebastia has historical photography, but not of the same subject as a
      // present-day shot - so there is nothing honest to compare.
      expect(await service.findBeforeAfter('sebastia')).toBeNull();
    });
  });

  describe('timeline', () => {
    it('returns the events in the order the content file gives them', async () => {
      const timeline = await service.findTimeline('sebastia');
      expect(timeline.length).toBeGreaterThan(5);
      expect(timeline.map((event) => event.sortOrder)).toEqual(
        [...timeline.map((event) => event.sortOrder)].sort((a, b) => a - b),
      );
      expect(timeline[0].periodLabel).toContain('Canaanite');
    });

    it('flags entries that rest on tradition rather than documented history', async () => {
      const timeline = await service.findTimeline('jerusalem');
      const traditions = timeline.filter((event) => event.isTradition);
      expect(traditions.length).toBeGreaterThan(0);
      expect(
        traditions.some((event) => /Old Testament/.test(event.description)),
      ).toBe(true);
    });

    it('cites the content file every event came from', async () => {
      for (const event of await service.findTimeline('bethlehem')) {
        expect(event.sourceFile).toBe('content/ai-ready/bethlehem-summary.md');
      }
    });
  });

  describe('quiz', () => {
    it('returns answerable questions that cite their source', async () => {
      const questions = await service.findQuiz('bethlehem');
      expect(questions.length).toBeGreaterThan(0);
      for (const question of questions) {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.answerIndex).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex).toBeLessThan(question.options.length);
        expect(question.explanation).toBeTruthy();
        expect(question.sourceNote).toBeTruthy();
      }
    });
  });

  describe('related locations', () => {
    it('suggests other locations that share a category, excluding itself', async () => {
      const related = await service.findRelated('jerusalem');
      expect(related.length).toBeGreaterThan(0);
      expect(related.map((location) => location.id)).not.toContain('jerusalem');
    });

    it('throws 404 for an unknown location', async () => {
      await expect(service.findRelated('atlantis')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
