import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 봉사활동 모집 공고에 대한 참가 신청

@ObjectType()
@Entity('Application')
export class Application {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  // 참가 신청의 수락여부
  @Field()
  @Column({ default: false })
  isAccepted: boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.applications,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field()
  @ManyToOne(
    () => Post,
    post => post.applications,
    { onDelete: 'CASCADE' },
  )
  post: Post;
}
