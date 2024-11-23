// openai.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiService {
  private apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async createThread(): Promise<string> {
    const response = await this.httpService.post(
      'https://api.openai.com/v1/threads',
      {},
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    ).toPromise();

    return response.data.id;
  }

  async addMessage(threadId: string, message: string): Promise<void> {
    await this.httpService.post(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { role: 'user', content: message },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    ).toPromise();
  }

  async runAssistant(threadId: string, assistantId: string): Promise<string> {
    const response = await this.httpService.post(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      { assistant_id: assistantId },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    ).toPromise();

    return response.data.id;
  }

  async checkStatus(threadId: string, runId: string): Promise<any> {
    const response = await this.httpService.get(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    ).toPromise();

    return response.data;
  }

  async getMessages(threadId: string): Promise<any[]> {
    const response = await this.httpService.get(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    ).toPromise();

    return response.data.data;
  }
}
