import { Processor, Process } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
@Processor('email-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'omid2000xd@gmail.com',
        pass: 'xgzn lmtv luhj qugi',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error en la configuración del correo:', error);
      } else {
        this.logger.log('Servidor listo para enviar correos');
      }
    });
  }

  @Process({ name: 'send-email', concurrency: 10 }) 
  async handleSendEmail(job: Job<{ id: number; to: string; message: string; retries: number }>) {
    const { id, to, message, retries = 0 } = job.data;

    try {
      await this.transporter.sendMail({
        from: 'omid2000xd@gmail.com',
        to,
        subject: 'Mensaje Automático, tal vez sin error',
        text: message,
      });
      
      this.logger.log(`Correo enviado exitosamente a: ${to}`);
    } catch (error) {
      this.logger.error(`Error enviando correo a ${to}:`, error.message);

      if (retries < 3) { 
        const delay = 3000;
        this.logger.warn(`Correo ${to} reencolado con ${delay / 1000}s de retraso.`);
        await this.emailQueue.add('send-email', { id, to, message, retries: retries + 1 }, { delay });
      } else {
        this.logger.error(`Correo ${to} falló después de 3 intentos.`);
      }
    }
  }
}