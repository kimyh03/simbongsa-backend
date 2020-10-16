import { Args, Query, Resolver } from '@nestjs/graphql';
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
}
