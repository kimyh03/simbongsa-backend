import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignUpInput, SignUpOutput } from './dto/SignUp.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => String)
  hi() {
    return 'hi';
  }

  @Query(() => String)
  getToken(@Args('userId') userId: number) {
    return this.userService.getToken(userId);
  }

  @Query(() => String)
  decodeToken(@Args('token') token: string) {
    return this.userService.decodeToken(token);
  }

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
}
