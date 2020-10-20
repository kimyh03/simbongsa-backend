import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { User } from 'src/user/user.entity';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';

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
  async toggleAccept(
    @CurrentUser() currentUser: User,
    @Args('applicationId') applicationId: number,
  ): Promise<CommonOutput> {
    try {
      const { error } = await this.applicationService.toggleIsAccepted(
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
      const { error } = await this.applicationService.delete(
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
}
