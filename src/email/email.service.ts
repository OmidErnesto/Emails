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
    const batchSize = 50;

    while (true) {
      const emails = await this.emailRepository.find({ take: batchSize, skip: offset });
      if (emails.length === 0) {
        console.log('No hay más correos para enviar.');
        break;
      }

      console.log(`Enviando lote de ${emails.length} correos...`);

      for (const email of emails) {
        try {
          await this.emailQueue.add('send-email',
            { id: email.id, to: email.to, message: email.message },
            {
              attempts: 3, 
              backoff: { type: 'fixed', delay: 10000 }, // Incrementar el tiempo de espera entre reintentos
              removeOnComplete: true,
              removeOnFail: false,
            }
          );
          console.log(`Correo agregado a la cola: ${email.to}`);
        } catch (error) {
          console.error(`Error al agregar correo ${email.to}:`, error.message);
        }
      }

      offset += batchSize;
      while ((await this.emailQueue.getJobCounts()).waiting > 0) {
        console.log('Esperando a que la cola se vacíe...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // Esperar 10 segundos antes de verificar nuevamente
      }
    
      console.log('Todos los correos han sido procesados.');
    }
  }
}