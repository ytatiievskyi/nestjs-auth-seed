import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field()
  name: string;

  @Field()
  content: string;

  @Field()
  mimetype: string;
}
