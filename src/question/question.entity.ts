import { Field, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToOne, RelationId } from 'typeorm';

// 봉사활동 모집 공고에 대한 질문

@ObjectType()
@Entity('Question')
export class Question extends CoreEntity {
  // 질문 내용
  @Field()
  @Column()
  text: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.questions,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field()
  @RelationId((question: Question) => question.user)
  @Column()
  userId: number;

  @Field(() => Post)
  @ManyToOne(
    () => Post,
    post => post.questions,
    { onDelete: 'CASCADE' },
  )
  post: Post;

  @Field()
  @RelationId((question: Question) => question.post)
  @Column()
  postId: number;

  @Field(() => Answer, { nullable: true })
  @OneToOne(
    () => Answer,
    answer => answer.question,
    { nullable: true },
  )
  answer?: Answer;
}
