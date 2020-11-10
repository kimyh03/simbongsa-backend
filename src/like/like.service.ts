import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async findOneByIds(userId: number, postId: number) {
    return await this.likeRepository.findOne({
      where: { userId, postId },
    });
  }

  async findAllByUserId(userId: number, relations?: string[]) {
    if (relations) {
      return await this.likeRepository.find({
        where: { userId },
        relations: [...relations],
      });
    } else {
      return await this.likeRepository.find({
        where: { userId },
      });
    }
  }

  async create(user: User, post: Post) {
    const newLike = this.likeRepository.create({ user, post });
    await this.likeRepository.save(newLike);
  }

  async remove(like: Like) {
    await this.likeRepository.remove(like);
  }
}
