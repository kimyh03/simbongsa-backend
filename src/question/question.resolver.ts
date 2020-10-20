import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async createQuestion(
    @CurrentUser() currentUser: User,
    @Args('postId') postId: number,
    @Args('text') text: string,
  ): Promise<CommonOutput> {
    try {
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
}
