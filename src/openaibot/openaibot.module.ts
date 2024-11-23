// openai.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThreadService } from './thread.service';
import { JsonService } from './json.service';
import { OpenAiController } from './openaibot.controller';
import { OpenAiService } from './openaibot.service';
import {  HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [OpenAiService, ThreadService, JsonService, OpenAiService],
  exports: [OpenAiService, ThreadService, JsonService],
  controllers: [OpenAiController],
})
export class OpenAiModule {}
