import { Field, ObjectType } from '@nestjs/graphql';
import {FileObject} from "../../../common/file/dto/file.object";

@ObjectType()
export class UserLinksObject {
  @Field({ nullable: true })
  instagram?: string;

  @Field({ nullable: true })
  telegram?: string;

  @Field({ nullable: true })
  whatsapp?: string;
}

@ObjectType()
export class UserObject {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  about: string;

  @Field(() => [String], { nullable: true })
  skills: string[];

  @Field(() => [String], { nullable: true })
  software: string[];

  @Field(() => UserLinksObject, { nullable: true })
  links: UserLinksObject;

  @Field(() => FileObject)
  avatar: FileObject;
}