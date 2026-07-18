import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * AskGuideDto
 *
 * Request payload for the conversational "ask the guide" AI feature,
 * where a user asks a free-form question about a location.
 */
export class AskGuideDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  language?: string;
}
