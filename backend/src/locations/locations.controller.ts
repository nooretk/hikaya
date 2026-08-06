import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from '../database/entities/location.entity';

/**
 * Locations endpoints.
 *
 * GET /api/v1/locations       -> all published locations, for the map
 * GET /api/v1/locations/:id   -> one location by slug ('jerusalem', ...)
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
