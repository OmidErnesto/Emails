import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { EmailService } from '../email/email.service';

@Injectable()
export class ConsoleService {
  constructor(private readonly emailService: EmailService) {}

  @Command({ command: 'send:emails', describe: 'Enviar correos desde la BD' })
  async sendEmails() {
    console.log('Iniciando envío de correos...');
    await this.emailService.sendBulkEmails();
    console.log('Envío de correos finalizado.');
  }
}