import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ApplicationModule } from './application/application.module';
import { LikeModule } from './like/like.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [UserModule, PostModule, ApplicationModule, LikeModule, QuestionModule, AnswerModule],
})
export class AppModule {}
