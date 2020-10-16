import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { commonOutput } from 'src/common/dto/CommonOutput';
import { User } from '../user.entity';

@InputType()
export class SignUpInput extends PickType(
  User,
  ['email', 'password', 'username'],
  InputType,
) {}

@ObjectType()
export class SignUpOutput extends commonOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
