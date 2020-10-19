import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { CreatePostInput, CreatePostOutput } from './dto/CreatePost.dto';
import { EditPostInput, EditPostOutput } from './dto/EditPost.dto';
import { GetPostDetailOutput } from './dto/GetPostDetail.dto';
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

  @Query(() => GetPostDetailOutput)
  async getPostDetail(
    @CurrentUser('user') currentUser: User,
    @Args('postId') postId: number,
  ): Promise<GetPostDetailOutput> {
    try {
      const { error, post } = await this.postService.findOneById(postId);
      if (error) throw new Error(error);
      if (currentUser) {
        if (post.userId === currentUser.id) {
          post.isMine = true;
        } else {
          post.isMine = false;
        }
        //Like 작업 후 추가예정
        /*
        const isLiked = await this.likeService.findOneByUserIdAndPostId(
          currentUser.id,
          postId,
        );
        if (isLiked) {
          post.isLiked = true;
        } else {
          post.isLiked = false;
        }
        */
      } else {
        post.isMine = false;
        post.isLiked = false;
      }
      return { ok: true, error: null, post };
    } catch (error) {
      return { ok: false, error: error.message, post: null };
    }
  }
}
