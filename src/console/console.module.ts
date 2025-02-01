import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ConsoleService } from './console.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [CommandModule, EmailModule],
  providers: [ConsoleService],
})
export class ConsoleModule {}
