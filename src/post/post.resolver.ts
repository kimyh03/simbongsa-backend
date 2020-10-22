import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from 'src/application/application.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CertificateService } from 'src/certificate/certificate.service';
import { LikeService } from 'src/like/like.service';
import { User } from 'src/user/user.entity';
import { CompletePostInput, CompletePostOutput } from './dto/CompletePost.dto';
import { CreatePostInput, CreatePostOutput } from './dto/CreatePost.dto';
import { DeletePostInput, DeletePostOutput } from './dto/DeletePost.dto';
import { EditPostInput, EditPostOutput } from './dto/EditPost.dto';
import { GetMyPostsOutput } from './dto/GetMyPosts.dto';
import {
  GetPostDetailInput,
  GetPostDetailOutput,
} from './dto/GetPostDetail.dto';
import { GetPostsInput, GetPostsOutput } from './dto/GetPosts.dto';
import {
  ToggleOpenAndCloseInput,
  ToggleOpenAndCloseOutput,
} from './dto/ToggleOpenAndClose.dto';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly likes: LikeService,
    private readonly applicatoins: ApplicationService,
    private readonly certificates: CertificateService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CreatePostOutput)
  async createPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const { error } = await this.postService.createPost(currentUser.id, args);
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
    @Args('args') args: EditPostInput,
  ): Promise<EditPostOutput> {
    try {
      const { error } = await this.postService.editPost(currentUser.id, args);
      if (error) throw new Error(error);
      return { ok: true, error: null };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  @Query(() => GetPostDetailOutput)
  async getPostDetail(
    @CurrentUser('user') user: User,
    @Args('args') args: GetPostDetailInput,
  ): Promise<GetPostDetailOutput> {
    try {
      let isMine, isLiked, isApplied;
      const { postId } = args;
      const { error, post } = await this.postService.findOneById(postId);
      if (error) throw new Error(error);
      if (user) {
        if (post.userId === user.id) isMine = true;
        const { like } = await this.likes.findOneByIds(user.id, postId);
        if (like) isLiked = true;
        const { application } = await this.applicatoins.findOneByIds(
          user.id,
          postId,
        );
        if (application) isApplied = true;
      }
      return { ok: true, error: null, post, isMine, isLiked, isApplied };
    } catch (error) {
      return { ok: false, error: error.message, post: null };
    }
  }

  @UseGuards(LogInOnly)
  @Mutation(() => ToggleOpenAndCloseOutput)
  async toggleOpenAndClose(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: ToggleOpenAndCloseInput,
  ): Promise<ToggleOpenAndCloseOutput> {
    try {
      const { postId } = args;
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
  @Mutation(() => DeletePostOutput)
  async deletePost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const { postId } = args;
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
  async getPosts(@Args('args') args: GetPostsInput): Promise<GetPostsOutput> {
    try {
      const {
        error,
        posts,
        totalCount,
        totalPage,
      } = await this.postService.findByFilter(args);
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
  @Mutation(() => CompletePostOutput)
  async completePost(
    @CurrentUser() currentUser: User,
    @Args('args') args: CompletePostInput,
  ): Promise<CompletePostOutput> {
    try {
      const { postId } = args;
      const { post, error } = await this.postService.findOneById(postId, [
        'applications',
      ]);
      if (error) throw new Error(error);
      const { error: PError } = await this.postService.setIsCompleteTrue(
        post,
        currentUser.id,
      );
      if (PError) throw new Error(PError);
      const { error: CError } = await this.certificates.create(
        post,
        currentUser.id,
      );
      if (CError) throw new Error(CError);
      const { error: AError } = await this.applicatoins.deleteAllOfPost(
        post,
        currentUser.id,
      );
      if (AError) throw new Error(AError);
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
