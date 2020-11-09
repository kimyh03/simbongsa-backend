import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class EditAvatarInput {
  @Field()
  avatarKey: string;
}

@ObjectType()
export class EditAvatarOutput extends CommonOutput {}
