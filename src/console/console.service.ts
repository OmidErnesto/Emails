import { Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { EmailService } from '../email/email.service';

@Command({
  name: 'send:emails',
  description: 'Enviar correos desde la BD', 
})
@Injectable()
export class ConsoleService extends CommandRunner {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async run(passedParams: string[], options?: any): Promise<void> {
    console.log('Iniciando envío de correos...');
    await this.emailService.sendBulkEmails();
    console.log('Envío de correos finalizado.');
  }
}