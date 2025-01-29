import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConsoleService } from './console.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: 'redis', port: 6379 },
    }),
    BullModule.registerQueue({ name: 'emailQueue' }),  // Registrar la cola aquí
  ],
  providers: [ConsoleService],
})
export class ConsoleModule {}
