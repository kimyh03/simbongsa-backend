import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class ApplyForPostInput {
  @Field()
  postId: number;
}

@ObjectType()
export class ApplyForPostOutput extends CommonOutput {}
