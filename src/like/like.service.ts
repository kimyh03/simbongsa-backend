import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LogInOnly)
  async toggleLike(postId: number, userId: number) {
    try {
      const existLike = await this.likeRepository.findOne({
        where: { userId, postId },
      });
      if (existLike) {
        this.likeRepository.remove(existLike);
      } else {
        const { user, error: uError } = await this.userService.findOneById(
          userId,
        );
        if (uError) throw new Error(uError.message);
        const { post, error: pError } = await this.postService.findOneById(
          postId,
        );
        if (pError) throw new Error(pError.message);
        const newLike = this.likeRepository.create({ user, post });
        await this.likeRepository.save(newLike);
      }
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async findOneByIds(userId: number, postId: number) {
    try {
      const like = await this.likeRepository.findOne({
        where: { userId, postId },
      });
      if (!like) throw new NotFoundException();
      return { error: null, like };
    } catch (error) {
      return { error: error.message, like: null };
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const likes = await this.likeRepository.find({
        where: { userId },
        relations: ['post'],
      });
      return { error: null, likes };
    } catch (error) {
      return { error: error.message, likes: null };
    }
  }
}
