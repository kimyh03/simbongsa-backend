import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { Post } from './post/post.entity';
import { Application } from './application/application.entity';
import { Like } from './like/like.entity';
import { Question } from './question/question.entity';
import { Answer } from './answer/answer.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { AssignUserMiddleware } from './auth/assignUser.middleware';
import { PostModule } from './post/post.module';
import { ApplicationModule } from './application/application.module';
import { LikeModule } from './like/like.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { CertificateModule } from './certificate/certificate.module';
import { Certificate } from './certificate/certificate.entity';
import { S3Module } from './S3/S3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        HASH_ROUNDS: Joi.string().required(),
        NODE_ENV: Joi.valid('prod', 'test', 'dev'),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Post, Application, Like, Question, Answer, Certificate],
      synchronize: true,
      logging: process.env.NODE_ENV === 'test' ? false : true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    UserModule,
    AuthModule,
    PostModule,
    ApplicationModule,
    LikeModule,
    QuestionModule,
    AnswerModule,
    CertificateModule,
    S3Module,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AssignUserMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
