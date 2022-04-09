import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserInput } from './dto/register-user.input';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../../domain/user/user.service';
import { UserCredentialsInput } from './dto/user-credentials.input';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { CreateFileInput } from '../file/dto/create-file.input';
import { FileService } from '../file/file.service';
import { Prisma } from '@prisma/client';

export interface VerifyUserDto {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private dbService: DatabaseService,
    private userService: UserService,
    private configService: ConfigService,
    private cacheService: RedisCacheService,
    private mailService: MailerService,
    private jwtService: JwtService,
    private fileService: FileService,
  ) {}

  //TODO: validate user input
  async requestRegistration(
    credentials: RegisterUserInput,
    avatar?: CreateFileInput,
  ) {
    const { email } = credentials;
    try {
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      await this.hashPassword(credentials);
      const token = await this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: 900000,
        },
      );
      await this.mailService.sendUserVerificationEmail(email, token);
      await this.userService.cacheUnverified(credentials);
      if (avatar) {
        await this.fileService.cacheUnverifiedUserAvatar(email, avatar);
      }
      return true;
    } catch (e) {
      //TODO: handle exceptions
      console.error(e);
      throw e;
    }
  }

  async validateCredentials(credentials: UserCredentialsInput): Promise<any> {
    const { email } = credentials;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const checkPayload = AuthService.getPayloadForHash(credentials);
    const passwordConfirmed = await bcrypt.compare(checkPayload, user.password);
    if (passwordConfirmed) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async hashPassword(credentials: UserCredentialsInput): Promise<void> {
    credentials.password = await bcrypt.hash(
      AuthService.getPayloadForHash(credentials),
      10,
    );
  }

  async generateUserToken(user: Prisma.UserSelect) {
    const { id, email } = user;
    const signOptions = {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('ACCESS_JWT_TTL'),
    };
    return this.jwtService.signAsync({ id, email }, signOptions);
  }
  
  async verifyToken(token: string) {
    const userData = await this.jwtService.verifyAsync(token);
    return userData;
  }

  static getPayloadForHash(credentials: UserCredentialsInput) {
    return `${credentials.email}:${credentials.password}`;
  }
}
