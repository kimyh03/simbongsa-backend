import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/application.entity';
import { ApplicationService } from 'src/application/application.service';
import { Certificate } from 'src/certificate/certificate.entity';
import { CertificateService } from 'src/certificate/certificate.service';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { Question } from 'src/question/question.entity';
import { QuestionService } from 'src/question/question.service';
import { UserModule } from 'src/user/user.module';
import { Post } from './post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, Application, Certificate, Question]),
    UserModule,
  ],
  providers: [
    PostResolver,
    PostService,
    LikeService,
    ApplicationService,
    CertificateService,
    QuestionService,
  ],
  exports: [PostService],
})
export class PostModule {}
