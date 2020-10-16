import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType()
export class SignUpInput extends PickType(
  User,
  ['email', 'password', 'username'],
  InputType,
) {}

@ObjectType()
export class SignUpOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  token?: string;
}
