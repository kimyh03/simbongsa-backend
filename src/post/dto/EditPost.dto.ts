import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { CreatePostInput } from './CreatePost.dto';

@InputType()
export class EditPostInput extends PartialType(CreatePostInput) {
  @Field()
  postId: number;
}

@ObjectType()
export class EditPostOutput extends CommonOutput {}
