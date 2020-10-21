import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { GetLikesOutput } from './dto/GetLikes.dot';
import { LikeService } from './like.service';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async toggleLike(
    @CurrentUser() currentUser: User,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.likeService.toggleLike(
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
        error,
      };
    }
  }

  @UseGuards(LogInOnly)
  @Query(() => GetLikesOutput)
  async getMyLikes(@CurrentUser() currentUser: User): Promise<GetLikesOutput> {
    const { likes, error } = await this.likeService.findAllByUserId(
      currentUser.id,
    );
    if (error) throw new Error(error);
    try {
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
