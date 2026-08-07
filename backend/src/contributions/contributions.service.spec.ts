import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ContributionsService } from './contributions.service';
import { LocationsService } from '../locations/locations.service';
import { InMemoryContributionsRepository } from '../database/repositories/contributions.repository';
import { InMemoryLocationsRepository } from '../database/repositories/locations.repository';
import {
  CONTRIBUTIONS_REPOSITORY,
  LOCATIONS_REPOSITORY,
} from '../database/repositories/tokens';

describe('ContributionsService', () => {
  let service: ContributionsService;

  const validSubmission = {
    locationId: 'bethlehem',
    title: 'My grandmother’s embroidery',
    content:
      'She stitched the same pattern her mother taught her, and every thread had a name we were expected to remember.',
    contributorName: 'Test Contributor',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributionsService,
        LocationsService,
        {
          provide: CONTRIBUTIONS_REPOSITORY,
          useClass: InMemoryContributionsRepository,
        },
        {
          provide: LOCATIONS_REPOSITORY,
          useClass: InMemoryLocationsRepository,
        },
      ],
    }).compile();

    service = module.get(ContributionsService);
  });

  it('stores a submission and returns the persisted record', async () => {
    const created = await service.create(validSubmission);
    expect(created.id).toBeTruthy();
    expect(created.locationId).toBe('bethlehem');
    expect(created.title).toBe(validSubmission.title);
    expect(created.submittedAt).toBeInstanceOf(Date);
  });

  it('holds every submission for review instead of publishing it', async () => {
    const created = await service.create(validSubmission);
    expect(created.status).toBe('pending_review');

    const approved = await service.findApprovedByLocation('bethlehem');
    expect(approved.map((item) => item.id)).not.toContain(created.id);
  });

  it('rejects a submission for a location that does not exist', async () => {
    await expect(
      service.create({ ...validSubmission, locationId: 'atlantis' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns the approved seeded contributions', async () => {
    const approved = await service.findApproved();
    expect(approved).toHaveLength(2);
    expect(approved.every((item) => item.status === 'approved')).toBe(true);
  });
});
