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
import { GetMyApplicationsOutput } from './dto/GetMyApplications.dto';
import {
  HandleApplicationInput,
  HandleApplicationOutput,
} from './dto/HandleApplication.dto';
import { ToggleApplyInput, ToggleApplyOutput } from './dto/ToggleApply.dto';

registerEnumType(applicationStatus, { name: 'applicationStatus' });

@Resolver()
export class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(LogInOnly)
  @Mutation(() => ToggleApplyOutput)
  async toggleApply(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: ToggleApplyInput,
  ): Promise<ToggleApplyOutput> {
    try {
      const { postId } = args;
      const {
        application: exist,
        error,
      } = await this.applicationService.findOneByIds(currentUser.id, postId);
      if (error) throw new Error(error);
      if (exist) {
        const { error: DError } = await this.applicationService.deleteByIds(
          currentUser.id,
          postId,
        );
        if (DError) throw new Error(DError);
      } else {
        const { error: CError } = await this.applicationService.create(
          currentUser.id,
          postId,
        );
        if (CError) throw new Error(CError);
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
      const { error } = await this.applicationService.setStatus(
        status,
        applicationId,
        currentUser.id,
      );
      if (error) throw new Error(error.message);
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
  @Query(() => GetMyApplicationsOutput)
  async getMyApplications(
    @CurrentUser() currentUser: User,
  ): Promise<GetMyApplicationsOutput> {
    try {
      const {
        applications,
        error,
      } = await this.applicationService.findAllByUserId(currentUser.id);
      if (error) throw new Error(error.message);
      return {
        applications,
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        applications: null,
        ok: false,
        error: error.message,
      };
    }
  }
}
