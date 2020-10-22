import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class AnswerTheQuestionInput {
  @Field()
  questionId: number;

  @Field()
  text: string;
}

@ObjectType()
export class AnswerTheQuestionOutput extends CommonOutput {}
