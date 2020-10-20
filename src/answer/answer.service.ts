import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionService } from 'src/question/question.service';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly questionService: QuestionService,
  ) {}

  async create(qeustionId: number, userId: number, text: string) {
    try {
      const {
        question,
        error,
        hostId,
      } = await this.questionService.findOneById(qeustionId);
      if (error) throw new Error(error);
      if (hostId !== userId) throw new UnauthorizedException();
      const newAnswer = this.answerRepository.create({ question, text });
      await this.answerRepository.save(newAnswer);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
