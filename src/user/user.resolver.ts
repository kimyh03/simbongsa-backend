import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { GetMeOutput } from './dto/GetMe.dto';
import { getProfileInput, GetProfileOutput } from './dto/GetProfile.dto';
import { SignInInput, SignInOutput } from './dto/SignIn.dto';
import { SignUpInput, SignUpOutput } from './dto/SignUp.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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

  @Query(() => GetProfileOutput)
  async getProfile(
    @CurrentUser('currentUser') currentUser: User,
    @Args('args') args: getProfileInput,
  ): Promise<GetProfileOutput> {
    try {
      const { userId } = args;
      const { user, error } = await this.userService.findOneById(userId);
      if (error) throw new Error(error.message);
      const isSelf = currentUser.id === userId;
      return {
        ok: true,
        error: null,
        user,
        isSelf,
      };
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
