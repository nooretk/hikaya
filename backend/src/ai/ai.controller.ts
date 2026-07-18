import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateStoryDto } from './dto/generate-story.dto';
import { AskGuideDto } from './dto/ask-guide.dto';

/**
 * AI endpoints (MVP skeleton).
 *
 * POST /api/v1/ai/generate-story -> request an AI-generated narrative
 * POST /api/v1/ai/ask-guide      -> ask the AI guide a free-form question
 */
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-story')
  generateStory(@Body() dto: GenerateStoryDto) {
    return this.aiService.generateStory(dto);
  }

  @Post('ask-guide')
  askGuide(@Body() dto: AskGuideDto) {
    return this.aiService.askGuide(dto);
  }
}
