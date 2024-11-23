// thread.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ThreadService {
  private readonly historyFile = path.join(__dirname, 'history.json');

  loadHistory(): any[] {
    try {
      const data = fs.readFileSync(this.historyFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  saveHistory(history: any[]): void {
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
  }

  findThreadId(client: string): string | null {
    const history = this.loadHistory();
    const thread = history.find(item => item.client === client);
    return thread ? thread.threadId : null;
  }

  saveThreadId(threadId: string, client: string): void {
    const history = this.loadHistory();
    const thread = history.find(item => item.client === client);

    if (thread) {
      thread.threadId = threadId;
    } else {
      history.push({ client, threadId });
    }

    this.saveHistory(history);
  }
}
