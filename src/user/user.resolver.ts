import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApplicationService } from 'src/application/application.service';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import notFound from 'src/common/exceptions/notFound';
import { LikeService } from 'src/like/like.service';
import { S3Service } from 'src/S3/S3.service';
import { EditAvatarInput, EditAvatarOutput } from './dto/EditAvatar.dto';
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
    private readonly s3Service: S3Service,
  ) {}

  @Mutation(() => SignUpOutput)
  async signUp(@Args('args') args: SignUpInput): Promise<SignUpOutput> {
    try {
      const existUser = await this.userService.findOneByInfomation(
        args.email,
        args.username,
      );
      if (existUser) throw new Error('이미 등록된 정보 입니다.');
      const token = await this.userService.createUser(args);
      return {
        ok: true,
        token,
      };
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
      const token = await this.userService.verifyUser(args);
      return {
        ok: true,
        token,
      };
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
      const user = await this.userService.findOneById(userId, [
        'posts',
        'certificates',
      ]);
      await notFound(user);
      user.activityCount = user.certificates?.length;
      let container = 0;
      for (let i = 0; i < user.activityCount; i++) {
        container = container + user.certificates[i].recognizedHours;
      }
      user.activityTime = container;
      const isSelf = currentUser?.id === userId;
      if (isSelf) {
        const likes = await this.likeService.findAllByUserId(currentUser.id, [
          'post',
        ]);
        const applications = await this.applicationService.findAllByUserId(
          currentUser.id,
          ['post'],
        );
        return {
          ok: true,
          user,
          isSelf,
          likes,
          applications,
        };
      } else {
        return {
          ok: true,
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

  @UseGuards(LogInOnly)
  @Mutation(() => EditAvatarOutput)
  async editAvatar(
    @CurrentUser('currentUser') CurrentUser: User,
    @Args('args') args: EditAvatarInput,
  ): Promise<EditAvatarOutput> {
    const { avatarKey } = args;
    const avatarUrl = `https://simbongsa1365.s3.ap-northeast-2.amazonaws.com/${avatarKey}`;
    const user = await this.userService.findOneById(CurrentUser.id);
    await notFound(user);
    if (user.avatar) {
      await this.s3Service.delete(user.avatar.split('avatar')[1]);
    }
    await this.userService.editAvatar(user, avatarUrl);
    try {
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  @Query(() => GetMeOutput)
  async getMe(
    @CurrentUser('currentUser') currentUser: User,
  ): Promise<GetMeOutput> {
    try {
      const user = await this.userService.findOneById(currentUser.id);
      await notFound(user);
      return {
        ok: true,
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

  @Query(() => Boolean)
  async CICDTest() {
    return false;
  }
}
