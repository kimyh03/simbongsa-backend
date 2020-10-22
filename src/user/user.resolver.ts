import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { GetProfileOutput } from './dto/GetProfile.dto';
import { SignInInput, SignInOutput } from './dto/SignIn.dto';
import { SignUpInput, SignUpOutput } from './dto/SignUp.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => SignUpOutput)
  async signUp(@Args('data') data: SignUpInput): Promise<SignUpOutput> {
    try {
      const { error, token } = await this.userService.createUser(data);
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

  @Mutation(() => SignInOutput)
  async signIn(@Args('data') data: SignInInput): Promise<SignInOutput> {
    try {
      const { token, error } = await this.userService.verifyUser(data);
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
    @Args('userId') userId: number,
  ): Promise<GetProfileOutput> {
    try {
      const { user, error } = await this.userService.findOneById(userId);
      if (error) throw new Error(error);
      const isSelf = currentUser.id === userId;
      user.isSelf = isSelf;
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
