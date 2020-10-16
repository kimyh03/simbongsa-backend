import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { commonOutput } from 'src/common/dto/CommonOutput';
import { User } from '../user.entity';

@InputType()
export class SignInInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class SignInOutput extends commonOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
