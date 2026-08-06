/**
 * Injection tokens for the repository layer.
 *
 * Services depend on these tokens, not on a concrete implementation, so the
 * same service code runs against PostgreSQL or against the in-memory seed.
 */
export const LOCATIONS_REPOSITORY = 'LOCATIONS_REPOSITORY';
export const STORIES_REPOSITORY = 'STORIES_REPOSITORY';
export const CONTRIBUTIONS_REPOSITORY = 'CONTRIBUTIONS_REPOSITORY';
