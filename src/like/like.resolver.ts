import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import notFound from 'src/common/exceptions/notFound';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.entity';
import { ToggleLikeInput, ToggleLikeOutput } from './dto/ToggleLike.dto';
import { LikeService } from './like.service';

@Resolver()
export class LikeResolver {
  constructor(
    private readonly likeService: LikeService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => ToggleLikeOutput)
  async toggleLike(
    @CurrentUser() currentUser: User,
    @Args('args') args: ToggleLikeInput,
  ): Promise<ToggleLikeOutput> {
    try {
      const { postId } = args;
      const existLike = await this.likeService.findOneByIds(
        currentUser.id,
        postId,
      );
      if (existLike) {
        await this.likeService.remove(existLike);
      } else {
        const post = await this.postService.findOneById(postId);
        await notFound(post);
        await this.likeService.create(currentUser, post);
      }
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
