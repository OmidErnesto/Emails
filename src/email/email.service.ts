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
    let offset = 0;
    const batchSize = 20;
    while (true) {
      const emails = await this.emailRepository.find({
        take: batchSize,
        skip: offset,
      });
  
      if (emails.length === 0) {
        this.logger.log('No hay más correos para enviar.');
        break;
      }
  
      this.logger.log(`Enviando lote de ${emails.length} correos...`);
  
      for (const email of emails) {
        try {
          await this.emailQueue.add(
            'send-email',
            { id: email.id, to: email.to, message: email.message },
            {
              attempts: 3,
              backoff: { type: 'exponential', delay: 2000 },
              removeOnComplete: true,
              removeOnFail: false,
            }
          );
          this.logger.log(`Correo agregado a la cola: ${email.to}`);
        } catch (error) {
          this.logger.error(`Error al agregar correo ${email.to}:`, error.message);
        }
      }
  
      offset += batchSize;
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}