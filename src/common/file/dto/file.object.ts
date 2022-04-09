import {Field, ObjectType} from '@nestjs/graphql';
import {CreateFileInput} from "./create-file.input";

@ObjectType()
export class FileObject extends CreateFileInput {
  @Field()
  id: string;
}
