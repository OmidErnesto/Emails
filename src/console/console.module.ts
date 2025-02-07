import { Module } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [ConsoleService],
})
export class ConsoleModule {}
