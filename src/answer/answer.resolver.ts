import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';

@Resolver()
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Query(() => [Answer])
  getAllAnswer() {
    return this.answerService.findAll();
  }

  @Mutation(() => Boolean)
  deleteAnswer(@Args('id') id: number) {
    this.answerService.delete(id);
    return true;
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async answerTheQuestion(
    @CurrentUser() currentUser: User,
    @Args('questionId') questionId: number,
    @Args('text') text: string,
  ): Promise<CommonOutput> {
    try {
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
