import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { InMemoryLocationsRepository } from '../database/repositories/locations.repository';
import { LOCATIONS_REPOSITORY } from '../database/repositories/tokens';

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: LOCATIONS_REPOSITORY,
          useClass: InMemoryLocationsRepository,
        },
      ],
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
});
