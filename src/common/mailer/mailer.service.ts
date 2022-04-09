import { Injectable } from '@nestjs/common';
import { MailerService as NestModulesMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly baseUrl = this.configService.get('BASE_URL');
  constructor(private mailerService: NestModulesMailerService, private configService: ConfigService) {}

  sendUserVerificationEmail(recipient: string, token: string) {
    const verificationUrl = `${this.baseUrl}/auth/verify?token=${token}`;
    return this.mailerService.sendMail({
      to: recipient,
      subject: 'Verify your account',
      template: 'verification-code',
      context: {
        verificationUrl
      }
    })
  }
}