import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';

/**
 * Locations endpoints (MVP skeleton).
 *
 * GET /api/v1/locations       -> list all locations for the interactive map
 * GET /api/v1/locations/:id   -> retrieve details for a single location
 */
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Location> {
    return this.locationsService.findOne(id);
  }
}
