import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/application.entity';
import { ApplicationService } from 'src/application/application.service';
import { AuthService } from 'src/auth/auth.service';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { Post } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Post, Application])],
  providers: [
    UserResolver,
    UserService,
    AuthService,
    LikeService,
    ApplicationService,
    PostService,
  ],
  exports: [UserService],
})
export class UserModule {}
