import { Field, InputType } from '@nestjs/graphql';
import { UserCredentialsInput } from './user-credentials.input';

@InputType()
export class RegisterUserInput extends UserCredentialsInput {
  @Field()
  username: string;

  @Field({ nullable: true })
  telegram: string;

  @Field({ nullable: true })
  instagram: string;

  @Field({ nullable: true })
  whatsapp: string;

  @Field({ nullable: true })
  about: string;

  @Field(() => [String], { nullable: true })
  skills: string[];

  @Field(() => [String], { nullable: true })
  software: string[];
}
