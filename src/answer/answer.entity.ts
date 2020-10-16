import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Question } from 'src/question/question.entity';
import { Column, Entity, OneToOne } from 'typeorm';

// 봉사활동 모집 공고 질문에 대한 답변

@ObjectType()
@Entity('Answer')
export class Answer extends CoreEntity {
  // 답변 내용
  @Field()
  @Column()
  text: string;

  @Field(() => Question)
  @OneToOne(
    () => Question,
    question => question.answer,
    { onDelete: 'CASCADE' },
  )
  question: Question;
}
