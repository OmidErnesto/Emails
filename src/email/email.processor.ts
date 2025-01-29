import { Processor, Process } from '@nestjs/bull';
import * as nodemailer from 'nodemailer';

@Processor('emailQueue')
export class EmailProcessor {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'tuemail@gmail.com', pass: 'tupassword' },
  });

  @Process()
  handleEmail(job) {
    const { to, message } = job.data;
    this.transporter.sendMail({
      from: 'tuemail@gmail.com',
      to,
      subject: 'Mensaje automático',
      text: message,
    });
  }
}