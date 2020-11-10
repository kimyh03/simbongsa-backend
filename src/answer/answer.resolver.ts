import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
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
      if (!question) throw new NotFoundException();
      if (question.post.userId !== currentUser.id)
        throw new UnauthorizedException();
      const existAnswer = await this.answerService.findOneByQuestionId(
        questionId,
      );
      if (existAnswer) throw new Error('이미 작성된 답변이 있습니다.');
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
