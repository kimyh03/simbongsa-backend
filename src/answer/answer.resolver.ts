import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { AnswerService } from './answer.service';
import {
  AnswerTheQuestionInput,
  AnswerTheQuestionOutput,
} from './dto/AnswerTheQuestion.dto';

@Resolver()
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => AnswerTheQuestionOutput)
  async answerTheQuestion(
    @CurrentUser() currentUser: User,
    @Args('args') args: AnswerTheQuestionInput,
  ): Promise<AnswerTheQuestionOutput> {
    try {
      const { questionId, text } = args;
      const { error } = await this.answerService.create(
        questionId,
        currentUser.id,
        text,
      );
      if (error) throw new Error(error);
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
