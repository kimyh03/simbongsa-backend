import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from '../user.entity';

@InputType()
export class SignInInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class SignInOutput extends CommonOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
