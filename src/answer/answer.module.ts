import { Module } from '@nestjs/common';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';

@Module({
  providers: [AnswerResolver, AnswerService]
})
export class AnswerModule {}
