import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from './email/email.module';
import { ConsoleModule } from './console/console.module';
import { ConsoleService } from './console/console.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'root',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EmailModule,
    ConsoleModule,
  ],
  providers: [ConsoleService],
})
export class AppModule {}