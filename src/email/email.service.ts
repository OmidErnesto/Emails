import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Email } from './email.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
    @InjectQueue('email-queue') private emailQueue: Queue,
  ) {}

  async sendBulkEmails() {
    const emails = await this.emailRepository.find();

    this.logger.log(`Total de correos a enviar: ${emails.length}`);

    if (emails.length === 0) {
      this.logger.log('No hay correos para enviar.');
      return;
    }

    for (const email of emails) {
      try {
        await this.emailQueue.add(
          'send-email',
          { id: email.id, to: email.to, message: email.message },
          {
            attempts: 3, 
            backoff: {
              type: 'exponential',
              delay: 2000, 
            },
            removeOnComplete: true,
            removeOnFail: false, 
          }
        );
        this.logger.log(`Agregado a la cola: ${email.to}`);
      } catch (error) {
        this.logger.error(`Error al agregar el correo ${email.to} a la cola:`, error.message);
      }
    }

    const queueCount = await this.emailQueue.getWaitingCount();
    this.logger.log(`Total de correos en la cola: ${queueCount}`);
  }
}