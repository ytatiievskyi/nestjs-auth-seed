import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VerifyUserGuard extends AuthGuard('verify-registration') {}