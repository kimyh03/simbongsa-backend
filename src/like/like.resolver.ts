import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { GetMyLikesOutput } from './dto/GetMyLikes.dot';
import { ToggleLikeInput, ToggleLikeOutput } from './dto/ToggleLike.dto';
import { LikeService } from './like.service';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => ToggleLikeOutput)
  async toggleLike(
    @CurrentUser() currentUser: User,
    @Args('args') args: ToggleLikeInput,
  ): Promise<ToggleLikeOutput> {
    try {
      const { postId } = args;
      const { error } = await this.likeService.toggleLike(
        postId,
        currentUser.id,
      );
      if (error) throw new Error(error.message);
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
  @Query(() => GetMyLikesOutput)
  async getMyLikes(
    @CurrentUser() currentUser: User,
  ): Promise<GetMyLikesOutput> {
    try {
      const { likes, error } = await this.likeService.findAllByUserId(
        currentUser.id,
      );
      if (error) throw new Error(error.message);
      return {
        ok: true,
        error: null,
        likes,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        likes: null,
      };
    }
  }
}
