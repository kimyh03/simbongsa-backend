import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Like } from '../like.entity';

@ObjectType()
export class GetMyLikesOutput extends CommonOutput {
  @Field(() => [Like], { nullable: true })
  likes?: Like[];
}
