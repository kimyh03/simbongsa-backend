import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 봉사활동 모집 공고에 대한 질문

@ObjectType()
@Entity('Question')
export class Question {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  // 질문 내용
  @Field()
  @Column()
  text: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.questions,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field(() => Post)
  @ManyToOne(
    () => Post,
    post => post.questions,
    { onDelete: 'CASCADE' },
  )
  post: Post;

  @Field(() => Answer, { nullable: true })
  @OneToOne(
    () => Answer,
    answer => answer.question,
    { nullable: true },
  )
  answer?: Answer;
}
