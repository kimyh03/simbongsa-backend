import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Post } from '../post.entity';

@ObjectType()
export class GetPostDetailOutput extends CommonOutput {
  @Field({ nullable: true })
  post?: Post;
}
