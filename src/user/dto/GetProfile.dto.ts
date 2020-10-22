import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
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
}
