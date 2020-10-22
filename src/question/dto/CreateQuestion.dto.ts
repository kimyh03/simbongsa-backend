import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class CreateQuestionInput {
  @Field()
  postId: number;

  @Field()
  text: string;
}

@ObjectType()
export class CreateQuestionOuput extends CommonOutput {}
