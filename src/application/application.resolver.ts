import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { ApplicationService } from './application.service';
import { applicationStatus } from './dto/ApplicationStatus.enum';
import { ApplyForPostInput, ApplyForPostOutput } from './dto/ApplyForPost.dto';
import {
  CalcelApplicationOutput,
  CancelApplicationInput,
} from './dto/CancelApplication.dto';
import { GetMyApplicationsOutput } from './dto/GetMyApplications.dto';
import {
  HandleApplicationInput,
  HandleApplicationOutput,
} from './dto/HandleApplication.dto';

registerEnumType(applicationStatus, { name: 'applicationStatus' });

@Resolver()
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => ApplyForPostOutput)
  async applyForPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: ApplyForPostInput,
  ): Promise<ApplyForPostOutput> {
    try {
      const { postId } = args;
      const { error } = await this.applicationService.create(
        currentUser.id,
        postId,
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
  @Mutation(() => HandleApplicationOutput)
  async handleApplication(
    @CurrentUser() currentUser: User,
    @Args('args') args: HandleApplicationInput,
  ): Promise<HandleApplicationOutput> {
    try {
      const { status, applicationId } = args;
      const { error } = await this.applicationService.setStatus(
        status,
        applicationId,
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
  @Mutation(() => CalcelApplicationOutput)
  async cancelApplication(
    @CurrentUser() currentUser: User,
    @Args('args') args: CancelApplicationInput,
  ): Promise<CalcelApplicationOutput> {
    try {
      const { postId } = args;
      const { error } = await this.applicationService.deleteByPostId(
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
  @Query(() => GetMyApplicationsOutput)
  async getMyApplications(
    @CurrentUser() currentUser: User,
  ): Promise<GetMyApplicationsOutput> {
    try {
      const {
        applications,
        error,
      } = await this.applicationService.findAllByUserId(currentUser.id);
      if (error) throw new Error(error);
      return {
        applications,
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        applications: null,
        ok: false,
        error,
      };
    }
  }
}
