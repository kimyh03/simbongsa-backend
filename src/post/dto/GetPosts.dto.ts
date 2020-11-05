import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Post } from '../post.entity';
import { postCategoryEnum } from './postCategory.enum';
import { postRigionEnum } from './postRigion.enum';

@InputType()
export class GetPostsInput {
  @Field(() => [postCategoryEnum], { nullable: true })
  categories?: postCategoryEnum[];

  @Field(() => [postRigionEnum], { nullable: true })
  rigions?: postRigionEnum[];

  @Field()
  page: number;

  @Field({ nullable: true })
  openOnly?: boolean;

  @Field({ nullable: true })
  searchTerm?: string;
}

@ObjectType()
export class GetPostsOutput extends CommonOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field({ nullable: true })
  totalCount?: number;

  @Field({ nullable: true })
  totalPage?: number;
}
