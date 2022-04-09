import { Field, InputType } from '@nestjs/graphql';
import { UserCredentialsInput } from './user-credentials.input';

@InputType()
export class LoginUserInput extends UserCredentialsInput {}