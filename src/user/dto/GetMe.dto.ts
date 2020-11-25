import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from '../user.entity';

@ObjectType()
export class GetMeOutput extends CommonOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
