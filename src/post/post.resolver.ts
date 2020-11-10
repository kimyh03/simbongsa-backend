import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from 'src/application/application.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CertificateService } from 'src/certificate/certificate.service';
import { LikeService } from 'src/like/like.service';
import { QuestionService } from 'src/question/question.service';
import { User } from 'src/user/user.entity';
import { CompletePostInput, CompletePostOutput } from './dto/CompletePost.dto';
import { CreatePostInput, CreatePostOutput } from './dto/CreatePost.dto';
import { DeletePostInput, DeletePostOutput } from './dto/DeletePost.dto';
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
    private readonly questionService: QuestionService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => CreatePostOutput)
  async createPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      await this.postService.createPost(currentUser, args);
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
      const post = await this.postService.findOneById(postId, ['user']);
      const questions = await this.questionService.findAllByPostId(postId, [
        'answer',
        'user',
      ]);
      const applications = await this.applicatoins.findAllByPostId(postId, [
        'user',
      ]);
      if (user) {
        if (post.userId === user.id) isMine = true;
        const existLike = await this.likes.findOneByIds(user.id, postId);
        if (existLike) isLiked = true;
        const existApplication = await this.applicatoins.findOneByIds(
          user.id,
          postId,
        );
        if (existApplication) isApplied = true;
      }
      return {
        ok: true,
        post,
        isMine,
        isLiked,
        isApplied,
        questions,
        applications,
      };
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
      const post = await this.postService.findOneById(postId);
      if (!post) throw new NotFoundException();
      if (post.userId !== currentUser.id) throw new UnauthorizedException();
      await this.postService.toggleOpenAndClose(post);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
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
      const post = await this.postService.findOneById(postId);
      if (!post) throw new NotFoundException();
      if (post.userId !== currentUser.id) throw new UnauthorizedException();
      await this.postService.delete(post);
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
        posts,
        totalCount,
        totalPage,
      } = await this.postService.findByFilter(args);
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
      const post = await this.postService.findOneById(postId, ['applications']);
      if (!post) throw new NotFoundException();
      if (post.userId !== currentUser.id) throw new UnauthorizedException();
      await this.postService.setIsCompleteTrue(post);
      await this.certificates.create(post, post.applications);
      await this.applicatoins.deleteAll(post.applications);
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
