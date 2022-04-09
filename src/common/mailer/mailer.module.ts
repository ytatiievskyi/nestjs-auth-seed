import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [ConfigModule, MailerService]
})
export class MailerModule {}
