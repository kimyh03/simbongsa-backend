import { UseGuards } from '@nestjs/common';
import { Args, Mutation, registerEnumType, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import notFound from 'src/common/exceptions/notFound';
import notMatch from 'src/common/exceptions/notMatch';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.entity';
import { ApplicationService } from './application.service';
import { applicationStatus } from './dto/ApplicationStatus.enum';
import {
  HandleApplicationInput,
  HandleApplicationOutput,
} from './dto/HandleApplication.dto';
import { ToggleApplyInput, ToggleApplyOutput } from './dto/ToggleApply.dto';

registerEnumType(applicationStatus, { name: 'applicationStatus' });

@Resolver()
export class ApplicationResolver {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(LogInOnly)
  @Mutation(() => ToggleApplyOutput)
  async toggleApply(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: ToggleApplyInput,
  ): Promise<ToggleApplyOutput> {
    try {
      const { postId } = args;
      const existApplication = await this.applicationService.findOneByIds(
        currentUser.id,
        postId,
      );
      if (existApplication) {
        await this.applicationService.delete(existApplication);
      } else {
        const post = await this.postService.findOneById(postId);
        await notFound(post);
        if (post.isCompleted === true || post.isOpened === false) {
          throw new Error('모집이 마감 되었습니다.');
        }
        await this.applicationService.create(currentUser, post);
      }
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
  @Mutation(() => HandleApplicationOutput)
  async handleApplication(
    @CurrentUser() currentUser: User,
    @Args('args') args: HandleApplicationInput,
  ): Promise<HandleApplicationOutput> {
    try {
      const { status, applicationId } = args;
      const application = await this.applicationService.findOneById(
        applicationId,
      );
      await notFound(application);
      const post = await this.postService.findOneById(application.postId);
      await notFound(post);
      await notMatch(post.userId, currentUser.id);
      if (status === applicationStatus.rejected) {
        await this.applicationService.delete(application);
      } else {
        await this.applicationService.setStatus(status, application);
      }
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
