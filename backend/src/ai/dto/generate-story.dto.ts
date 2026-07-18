import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * GenerateStoryDto
 *
 * Request payload sent from the backend to the AI narrative-generation
 * module. Field names are aligned with the AI-backend JSON contract
 * defined by the AI Smart Features Team (see ai/ folder).
 */
export class GenerateStoryDto {
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsString()
  @IsNotEmpty()
  historicalText: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsIn(['neutral', 'educational', 'emotional', 'storytelling'])
  tone?: string;
}
