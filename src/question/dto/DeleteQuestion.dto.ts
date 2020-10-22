import { Field, InputType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class DeleteQuestionInput {
  @Field()
  questionId: number;
}

export class DeleteQuestionOutput extends CommonOutput {}
