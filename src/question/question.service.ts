import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async create(text: string, postId: number, userId: number) {
    try {
      const { post, error: pError } = await this.postService.findOneById(
        postId,
      );
      const { user, error: uError } = await this.userService.findOneById(
        userId,
      );
      if (pError) throw new Error(pError);
      if (uError) throw new Error(uError);
      const newQuestion = this.questionRepository.create({ post, user, text });
      await this.questionRepository.save(newQuestion);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async delete(questionId: number, userId: number) {
    try {
      const existQuestion = await this.questionRepository.findOne(questionId);
      if (!existQuestion) throw new NotFoundException();
      if (existQuestion.userId !== userId) throw new UnauthorizedException();
      this.questionRepository.remove(existQuestion);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
