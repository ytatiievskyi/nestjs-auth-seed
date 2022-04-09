import { Query, Resolver } from '@nestjs/graphql';
import { UserObject } from './dto/user.object';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { JwtPayloadDto } from '../../common/auth/dto/jwt-payload.dto';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/auth/guards/graphql-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserObject)
  getMe(@CurrentUser() userCreds: JwtPayloadDto) {
    return this.userService.findByEmail(userCreds.email);
  }
}
