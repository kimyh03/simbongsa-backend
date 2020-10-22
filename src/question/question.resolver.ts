import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import {
  CreateQuestionInput,
  CreateQuestionOuput,
} from './dto/CreateQuestion.dto';
import {
  DeleteQuestionInput,
  DeleteQuestionOutput,
} from './dto/DeleteQuestion.dto';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CreateQuestionOuput)
  async createQuestion(
    @CurrentUser() currentUser: User,
    @Args('args') args: CreateQuestionInput,
  ): Promise<CreateQuestionOuput> {
    try {
      const { postId, text } = args;
      const { error } = await this.questionService.create(
        text,
        postId,
        currentUser.id,
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

  @UseGuards(LogInOnly)
  @Mutation(() => DeleteQuestionOutput)
  async deleteQuestion(
    @CurrentUser() currentUser: User,
    @Args('args') args: DeleteQuestionInput,
  ): Promise<DeleteQuestionOutput> {
    try {
      const { questionId } = args;
      const { error } = await this.questionService.delete(
        questionId,
        currentUser.id,
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
