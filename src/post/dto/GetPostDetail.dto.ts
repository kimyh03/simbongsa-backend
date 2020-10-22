import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Post } from '../post.entity';

@InputType()
export class GetPostDetailInput {
  @Field()
  postId: number;
}

@ObjectType()
export class GetPostDetailOutput extends CommonOutput {
  @Field({ nullable: true })
  post?: Post;
}
