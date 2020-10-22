import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { AnswerService } from './answer.service';

@Resolver()
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

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
