import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GenerateStoryDto } from './dto/generate-story.dto';
import { AskGuideDto } from './dto/ask-guide.dto';
import { GeneratedStory } from './interfaces/generated-story.interface';

/**
 * AiService
 *
 * Skeleton client for the AI narrative-generation microservice
 * (planned to be implemented in Python, see ai/ folder for the
 * workflow and JSON contract). Endpoints are not functional yet -
 * they document the intended integration shape for Sprint 1.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly httpService: HttpService) {}

  generateStory(dto: GenerateStoryDto): Promise<GeneratedStory> {
    // TODO: call the Python AI service, e.g.:
    // const { data } = await firstValueFrom(
    //   this.httpService.post<GeneratedStory>('/generate-story', dto),
    // );
    // return data;
    this.logger.debug(`generateStory called with: ${JSON.stringify(dto)}`);
    return Promise.resolve({
      title: 'Placeholder title',
      summary: 'Placeholder summary',
      narrative: 'Placeholder narrative - AI service not yet integrated.',
    });
  }

  askGuide(dto: AskGuideDto): Promise<{ answer: string }> {
    // TODO: call the Python AI service's conversational endpoint
    this.logger.debug(`askGuide called with: ${JSON.stringify(dto)}`);
    return Promise.resolve({
      answer: 'Placeholder answer - AI service not yet integrated.',
    });
  }
}
