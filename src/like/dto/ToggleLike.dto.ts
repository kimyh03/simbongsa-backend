import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class ToggleLikeInput {
  @Field()
  postId: number;
}

@ObjectType()
export class ToggleLikeOutput extends CommonOutput {}
