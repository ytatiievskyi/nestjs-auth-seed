import {
  Controller,
  Get,
  Logger,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { VerifyUserGuard } from './guards/verify-user.guard';
import { FileService } from '../file/file.service';
import { UserService } from '../../domain/user/user.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

const logger = new Logger();

@Controller('auth')
export class AuthController {
  private readonly frontendUrl = this.configService.get('FRONTEND_URL');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fileService: FileService,
    private configService: ConfigService,
  ) {}

  @UseGuards(VerifyUserGuard)
  @Get('verify')
  async verifyUser(@CurrentUser() user, @Res() res: Response) {
    //TODO: user and all the connected entities insert should be atomic. Put into single transaction
    const file = await this.fileService.saveUserAvatarFromRedis(user);
    const payload = file
      ? { ...user, fileId: file.id }
      : user;
    const created = await this.userService.create(payload);
    logger.log(JSON.stringify(created), 'Saved user');
    return res.redirect(this.frontendUrl);
  }
}
