import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as readline from 'readline';

@Injectable()
export class ConsoleService {
  constructor(@InjectQueue('emailQueue') private emailQueue: Queue) {
    this.init();
  }

  init() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.setPrompt('sends\n');
    rl.prompt();
    rl.on('line', () => this.sendEmails());
  }

  sendEmails() {
    const emails = Array.from({ length: 100 }, (_, i) => ({
      to: `user${i + 1}@example.com`,
      message: `Mensaje para usuario ${i + 1}`,
    }));
    emails.forEach(email => this.emailQueue.add(email));
  }
}
