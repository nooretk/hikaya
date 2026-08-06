import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../database/entities/location.entity';
import type { LocationsRepository } from '../database/repositories/locations.repository';
import { LOCATIONS_REPOSITORY } from '../database/repositories/tokens';

/**
 * LocationsService
 *
 * Serves the heritage locations shown on the map. The repository behind it is
 * either PostgreSQL or the in-memory seed, decided at boot in DatabaseModule.
 */
@Injectable()
export class LocationsService {
  constructor(
    @Inject(LOCATIONS_REPOSITORY)
    private readonly locations: LocationsRepository,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locations.findAll();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locations.findById(id);
    if (!location) {
      throw new NotFoundException(`Location with id "${id}" not found`);
    }
    return location;
  }
}
