// openai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OpenAiService } from './openaibot.service';
import { ThreadService } from './thread.service';

@Controller('openai')
export class OpenAiController {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly threadService: ThreadService,
  ) {}

  @Post('handle-message')
  async handleMessage(
    @Body('message') message: string,
    @Body('client') client: string,
  ): Promise<any> {
    let threadId = this.threadService.findThreadId(client);

    if (!threadId) {
      threadId = await this.openAiService.createThread();
      this.threadService.saveThreadId(threadId, client);
    }

    await this.openAiService.addMessage(threadId, message);
    const runId = await this.openAiService.runAssistant(threadId, threadId);

    // Lógica para verificar e retornar resposta...
  }
}
