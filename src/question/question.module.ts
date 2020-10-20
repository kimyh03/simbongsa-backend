import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { Question } from './question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), PostModule, UserModule],
  providers: [QuestionResolver, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
