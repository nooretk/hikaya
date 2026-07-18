import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

/**
 * AiModule
 *
 * Wraps calls to the external AI service. The AI narrative-generation
 * logic itself is expected to live in a separate Python service (see
 * the ai/ folder for the workflow design owned by the AI Smart
 * Features Team). This module only defines the NestJS-side contract
 * and HTTP client used to reach that service.
 */
@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 10000,
      baseURL: process.env.AI_SERVICE_URL ?? 'http://localhost:8001',
    }),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
