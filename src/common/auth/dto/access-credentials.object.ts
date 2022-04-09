import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessCredentialsObject {
  @Field()
  access: string;
}