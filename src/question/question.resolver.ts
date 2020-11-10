import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.entity';
import {
  CreateQuestionInput,
  CreateQuestionOuput,
} from './dto/CreateQuestion.dto';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CreateQuestionOuput)
  async createQuestion(
    @CurrentUser() currentUser: User,
    @Args('args') args: CreateQuestionInput,
  ): Promise<CreateQuestionOuput> {
    try {
      const { postId, text } = args;
      const post = await this.postService.findOneById(postId);
      if (!post) throw new NotFoundException();
      await this.questionService.create(text, post, currentUser);
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
