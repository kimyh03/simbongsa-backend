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

  async findAll() {
    return this.answerRepository.find({ relations: ['question'] });
  }

  async delete(id: number) {
    const answer = await this.answerRepository.findOne(id);
    this.answerRepository.remove(answer);
    return null;
  }

  async create(questionId: number, userId: number, text: string) {
    try {
      const existAnswer = await this.answerRepository.findOne({
        where: { questionId },
      });
      console.log(existAnswer);
      if (existAnswer) throw new Error('이미 답변했습니다.');
      const {
        question,
        error,
        hostId,
      } = await this.questionService.findOneById(questionId);
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
