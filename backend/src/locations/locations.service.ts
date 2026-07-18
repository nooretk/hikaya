import { Injectable, NotFoundException } from '@nestjs/common';
import { Location } from './entities/location.entity';

/**
 * LocationsService
 *
 * Skeleton service for MVP location retrieval.
 * TODO: Replace in-memory placeholder with real database access
 * (PostgreSQL, following database/schema-draft.md) once the
 * persistence layer is wired up.
 */
@Injectable()
export class LocationsService {
  findAll(): Promise<Location[]> {
    // TODO: fetch from the `locations` table
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<Location> {
    // TODO: fetch a single location by id from the database
    return Promise.reject(
      new NotFoundException(`Location with id "${id}" not found`),
    );
  }
}
