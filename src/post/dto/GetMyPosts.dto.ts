import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Post } from '../post.entity';

@ObjectType()
export class GetMyPostsOutput extends CommonOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
