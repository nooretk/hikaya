import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
} from 'class-validator';

/**
 * CreateContributionDto
 *
 * Payload for a user submitting a memory/story/photo contribution
 * for a given location. TODO: align with the final `contributions`
 * table once the database schema is implemented.
 */
export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  contributorName?: string;

  @IsOptional()
  @IsEmail()
  contributorEmail?: string;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}
