import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class ToggleApplyInput {
  @Field()
  postId: number;
}

@ObjectType()
export class ToggleApplyOutput extends CommonOutput {}
