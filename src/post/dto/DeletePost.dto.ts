import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class DeletePostInput {
  @Field()
  postId: number;
}

@ObjectType()
export class DeletePostOutput extends CommonOutput {}
