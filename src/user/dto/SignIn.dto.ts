import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType()
export class SignInInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class SignInOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  token?: string;
}
