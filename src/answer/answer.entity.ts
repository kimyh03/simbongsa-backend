import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/question/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 봉사활동 모집 공고 질문에 대한 답변

@ObjectType()
@Entity('Answer')
export class Answer {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  // 답변 내용
  @Field()
  @Column()
  text: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Question)
  @OneToOne(
    () => Question,
    question => question.answer,
    { onDelete: 'CASCADE' },
  )
  question: Question;
}
