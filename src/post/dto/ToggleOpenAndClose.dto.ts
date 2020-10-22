import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class ToggleOpenAndCloseInput {
  @Field()
  postId: number;
}

@ObjectType()
export class ToggleOpenAndCloseOutput extends CommonOutput {}
