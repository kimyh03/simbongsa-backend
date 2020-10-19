import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { CreatePostInput, CreatePostOutput } from './dto/CreatePost.dto';
import { EditPostInput, EditPostOutput } from './dto/EditPost.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  async getPosts() {
    return await this.postService.findAllPosts();
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CreatePostOutput)
  async createPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('data') data: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const { error } = await this.postService.createPost(currentUser.id, data);
      if (error) {
        throw Error(error);
      } else {
        return { ok: true, error: null };
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  @UseGuards(LogInOnly)
  @Mutation(() => EditPostOutput)
  async editPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('data') data: EditPostInput,
    @Args('postId') postId: number,
  ): Promise<EditPostOutput> {
    try {
      const { error } = await this.postService.editPost(
        currentUser.id,
        postId,
        data,
      );
      if (error) throw new Error(error);
      return { ok: true, error: null };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
