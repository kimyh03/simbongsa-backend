import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class CompletePostInput {
  @Field()
  postId: number;
}

@ObjectType()
export class CompletePostOutput extends CommonOutput {}
