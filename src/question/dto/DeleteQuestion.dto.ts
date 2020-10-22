import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class DeleteQuestionInput {
  @Field()
  questionId: number;
}

@ObjectType()
export class DeleteQuestionOutput extends CommonOutput {}
