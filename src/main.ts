import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmailService } from './email/email.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  //const emailService = app.get(EmailService);

  //console.log('Iniciando envío de correos...');
  //await emailService.sendBulkEmails();
  //console.log('Envío de correos finalizado.');

  await app.close();
}

bootstrap();