import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../../domain/user/user.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { DatabaseService } from '../database/database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '../mailer/mailer.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { VerifyRegistrationStrategy } from './strategies/verify-registration.strategy';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    UserModule,
    MailerModule,
    ConfigModule,
    RedisCacheModule,
    FileModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    DatabaseService,
    JwtStrategy,
    VerifyRegistrationStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthResolver, DatabaseService],
})
export class AuthModule {}
