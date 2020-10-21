import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from 'src/application/application.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { LikeService } from 'src/like/like.service';
import { User } from 'src/user/user.entity';
import { CreatePostInput } from './dto/CreatePost.dto';
import { EditPostInput } from './dto/EditPost.dto';
import { GetMyPostsOutput } from './dto/GetMyPosts.dto';
import { GetPostDetailOutput } from './dto/GetPostDetail.dto';
import { GetPostsInput, GetPostsOutput } from './dto/GetPosts.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly likes: LikeService,
    private readonly applicatoins: ApplicationService,
  ) {}

  @Query(() => [Post])
  async getAllPosts() {
    return await this.postService.findAllPosts();
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async createPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('data') data: CreatePostInput,
  ): Promise<CommonOutput> {
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
  @Mutation(() => CommonOutput)
  async editPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('data') data: EditPostInput,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
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
    @CurrentUser('user') user: User,
    @Args('postId') postId: number,
  ): Promise<GetPostDetailOutput> {
    try {
      const { error, post } = await this.postService.findOneById(postId);
      if (error) throw new Error(error);
      if (user) {
        if (post.userId === user.id) post.isMine = true;
        const { like } = await this.likes.findOneByIds(user.id, postId);
        if (like) post.isLiked = true;
        const { application } = await this.applicatoins.findOneByIds(
          user.id,
          postId,
        );
        if (application) post.isApplied = true;
      }
      return { ok: true, error: null, post };
    } catch (error) {
      return { ok: false, error: error.message, post: null };
    }
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async toggleOpenAndClose(
    @CurrentUser('currentUser') currentUser: User,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.postService.toggleOpenAndClose(
        currentUser.id,
        postId,
      );
      if (error) throw new Error(error);
      return { ok: true, error: null };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  @UseGuards(LogInOnly)
  @Query(() => GetMyPostsOutput)
  async getMyPosts(
    @CurrentUser('currentUser') currentUser: User,
  ): Promise<GetMyPostsOutput> {
    try {
      const { posts, error } = await this.postService.findAllByUserId(
        currentUser.id,
      );
      if (error) throw new Error(error);
      return {
        ok: true,
        error: null,
        posts,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        posts: null,
      };
    }
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async deletePost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.postService.delete(currentUser.id, postId);
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

  @Query(() => GetPostsOutput)
  async getPosts(@Args('data') data: GetPostsInput): Promise<GetPostsOutput> {
    try {
      const {
        error,
        posts,
        totalCount,
        totalPage,
      } = await this.postService.findByFilter(data);
      if (error) throw new Error(error);
      return {
        ok: true,
        error: null,
        posts,
        totalCount,
        totalPage,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async completePost(
    @CurrentUser() currentUser: User,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.postService.setIsCompleteTrue(
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
}
