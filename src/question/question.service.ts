import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(text: string, post: Post, user: User) {
    const newQuestion = this.questionRepository.create({ post, user, text });
    await this.questionRepository.save(newQuestion);
  }

  async findOneById(id: number, relations?: string[]) {
    if (relations) {
      return await this.questionRepository.findOne({
        where: { id },
        relations: [...relations],
      });
    } else {
      return await this.questionRepository.findOne({
        where: { id },
      });
    }
  }

  async findAllByPostId(postId: number, relations?: string[]) {
    if (relations) {
      return await this.questionRepository.find({
        where: { postId },
        relations: [...relations],
      });
    } else {
      return await this.questionRepository.find({
        where: { postId },
      });
    }
  }
}
