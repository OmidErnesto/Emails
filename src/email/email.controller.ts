import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmails() {
    await this.emailService.sendBulkEmails();
    return { message: 'Emails en cola para ser enviados' };
  }
}
