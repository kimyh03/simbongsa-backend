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
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { applicationStatus } from './dto/ApplicationStatus.enum';
import { GetMyApplicationsOutput } from './dto/GetMyApplications.dto';

registerEnumType(applicationStatus, { name: 'applicationStatus' });

@Resolver()
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Query(() => [Application])
  async getAllApplications() {
    return await this.applicationService.findAll();
  }

  @UseGuards(LogInOnly)
  @Mutation(() => CommonOutput)
  async applyForPost(
    @CurrentUser('currentUser') currentUser: User,
    @Args('postId') postId: number,
  ): Promise<CommonOutput> {
    try {
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
  @Mutation(() => CommonOutput)
  async handleApplication(
    @CurrentUser() currentUser: User,
    @Args('applicationId') applicationId: number,
    @Args('status') status: applicationStatus,
  ): Promise<CommonOutput> {
    try {
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
  @Mutation(() => CommonOutput)
  async cancelApplication(
    @CurrentUser() currentUser: User,
    @Args('applicationId') applicationId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.applicationService.deleteById(
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
