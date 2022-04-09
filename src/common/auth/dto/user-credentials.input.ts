import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCredentialsInput {
  @Field()
  email: string;

  @Field()
  password: string;
}