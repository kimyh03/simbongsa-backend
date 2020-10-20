import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { Like } from './like.entity';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), PostModule, UserModule],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
