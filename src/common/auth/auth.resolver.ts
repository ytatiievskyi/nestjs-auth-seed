import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { NotFoundException } from '@nestjs/common';
import { AccessCredentialsObject } from './dto/access-credentials.object';
import { CreateFileInput } from '../file/dto/create-file.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean, {
    description: `Saves user data to redis and sends verification email with token in URL.
       User is saved to DB only after verification.
       Token ttl is 15 minutes.
       Optional avatar supports images in base64 string`,
  })
  async register(
    @Args('credentials') credentials: RegisterUserInput,
    @Args('avatar', { nullable: true }) avatar: CreateFileInput,
  ) {
    return this.authService.requestRegistration(credentials, avatar);
  }

  @Mutation(() => AccessCredentialsObject)
  async login(@Args('credentials') credentials: LoginUserInput) {
    const user = await this.authService.validateCredentials(credentials);
    if (!user) {
      throw new NotFoundException('No user exists by these credentials');
    }
    const accessToken = await this.authService.generateUserToken(user);
    return { access: accessToken };
  }
}
