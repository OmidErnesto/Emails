import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { Email } from './email.entity';

@Injectable()
@Processor('email-queue')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'omid2000xd@gmail.com',  //Debes crear una contrase de aplicacion para el correo que utilices
        pass: 'xgzn lmtv luhj qugi  ', //La contraseña es una "contraseña de aplicación" que se puede crear para no utilizar tu contraseña original 
      },
      tls: {
        rejectUnauthorized: false, // Esto desactiva la verificación del certificado. No se recomienda para producción
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

  @Process({ name: 'send-email', concurrency: 20 }) 
  async handleSendEmail(job: Job<{ id: number; to: string; message: string }>) {
    const { id, to, message } = job.data;
    
    try {
      await this.transporter.sendMail({
        from: 'omid2000xd@gmail.com',
        to,
        subject: 'Mensaje Automático',
        text: message,
      });

      this.logger.log(` Correo enviado exitosamente a: ${to}`);
    } catch (error) {
      this.logger.error(`Error enviando correo a ${to}:`, error.message);
    }
  }
}