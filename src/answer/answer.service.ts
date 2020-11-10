import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/question/question.entity';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(question: Question, text: string) {
    const newAnswer = this.answerRepository.create({ question, text });
    await this.answerRepository.save(newAnswer);
  }

  async findOneByQuestionId(questionId: number) {
    return await this.answerRepository.findOne({ questionId });
  }
}
