import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, VerifyUserDto } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../domain/user/user.service';

@Injectable()
export class VerifyRegistrationStrategy extends PassportStrategy(
  Strategy,
  'verify-registration',
) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: VerifyUserDto) {
    return this.userService.getUnverifiedFromCache(payload);
  }
}
