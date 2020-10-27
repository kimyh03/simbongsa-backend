import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from 'src/application/application.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LikeService } from 'src/like/like.service';
import { GetMeOutput } from './dto/GetMe.dto';
import { getProfileInput, GetProfileOutput } from './dto/GetProfile.dto';
import { SignInInput, SignInOutput } from './dto/SignIn.dto';
import { SignUpInput, SignUpOutput } from './dto/SignUp.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly likeService: LikeService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Mutation(() => SignUpOutput)
  async signUp(@Args('args') args: SignUpInput): Promise<SignUpOutput> {
    try {
      const { error, token } = await this.userService.createUser(args);
      if (error) {
        throw Error(error.message);
      } else {
        return {
          ok: true,
          token,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  @Mutation(() => SignInOutput)
  async signIn(@Args('args') args: SignInInput): Promise<SignInOutput> {
    try {
      const { token, error } = await this.userService.verifyUser(args);
      if (error) {
        throw Error(error);
      } else {
        return {
          ok: true,
          token,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  @Query(() => GetProfileOutput)
  async getProfile(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: getProfileInput,
  ): Promise<GetProfileOutput> {
    try {
      const { userId } = args;
      const { user, error } = await this.userService.findOneById(userId, [
        'posts',
        'certificates',
      ]);
      if (error) throw new Error(error.message);
      user.activityCount = user.certificates?.length;
      let container = 0;
      for (let i = 0; i < user.activityCount; i++) {
        container = container + user.certificates[i].recognizedHours;
      }
      user.activityTime = container;
      const isSelf = currentUser.id === userId;
      if (isSelf) {
        const { likes, error: Lerror } = await this.likeService.findAllByUserId(
          currentUser.id,
        );
        if (Lerror) throw new Error(error.message);
        const {
          applications,
          error: Aerror,
        } = await this.applicationService.findAllByUserId(currentUser.id);
        if (Aerror) throw new Error(error.message);
        return {
          ok: true,
          error: null,
          user,
          isSelf,
          likes,
          applications,
        };
      } else {
        return {
          ok: true,
          error: null,
          user,
          isSelf,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        user: null,
      };
    }
  }

  @Query(() => GetMeOutput)
  async getMe(
    @CurrentUser('currentUser') currentUser: User,
  ): Promise<GetMeOutput> {
    try {
      const { user, error } = await this.userService.findOneById(
        currentUser.id,
      );
      if (error) throw new Error(error);
      return {
        ok: true,
        error: null,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        user: null,
      };
    }
  }
}
