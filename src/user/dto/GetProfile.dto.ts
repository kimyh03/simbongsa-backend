import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Like } from 'src/like/like.entity';
import { User } from '../user.entity';

@InputType()
export class getProfileInput {
  @Field()
  userId: number;
}

@ObjectType()
export class GetProfileOutput extends CommonOutput {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ defaultValue: false })
  isSelf?: boolean;

  @Field(() => [Like], { nullable: true })
  likes?: Like[];

  @Field(() => [Application], { nullable: true })
  applications?: Application[];
}
