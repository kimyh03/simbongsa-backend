import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import isExist from 'src/common/exceptions/isExist';
import notFound from 'src/common/exceptions/notFound';
import notMatch from 'src/common/exceptions/notMatch';
import { QuestionService } from 'src/question/question.service';
import { User } from 'src/user/user.entity';
import { AnswerService } from './answer.service';
import {
  AnswerTheQuestionInput,
  AnswerTheQuestionOutput,
} from './dto/AnswerTheQuestion.dto';

@Resolver()
export class AnswerResolver {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => AnswerTheQuestionOutput)
  async answerTheQuestion(
    @CurrentUser() currentUser: User,
    @Args('args') args: AnswerTheQuestionInput,
  ): Promise<AnswerTheQuestionOutput> {
    try {
      const { questionId, text } = args;
      const question = await this.questionService.findOneById(questionId, [
        'post',
      ]);
      await notFound(question);
      await notMatch(question.post.userId, currentUser.id);
      const existAnswer = await this.answerService.findOneByQuestionId(
        questionId,
      );
      await isExist(existAnswer);
      await this.answerService.create(question, text);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
