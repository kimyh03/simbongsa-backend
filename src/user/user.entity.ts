import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { Like } from 'src/like/like.entity';
import { Post } from 'src/post/post.entity';
import { Question } from 'src/question/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 사용자

@ObjectType()
@Entity('User')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  // 이메일(로그인 ID)
  @Field()
  @Column()
  email: string;

  // 사용자 넥네임
  @Field()
  @Column()
  username: string;

  // 비밀번호(로그인 PW)
  @Field()
  @Column()
  password: string;

  // 프로필 사진
  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => [Post], { nullable: true })
  @OneToMany(
    () => Post,
    post => post.user,
    { nullable: true },
  )
  posts?: Post[];

  @Field(() => [Application], { nullable: true })
  @OneToMany(
    () => Application,
    application => application.user,
    { nullable: true },
  )
  applications?: Application[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(
    () => Like,
    like => like.user,
    { nullable: true },
  )
  likes: Like[];

  @Field(() => [Question], { nullable: true })
  @OneToMany(
    () => Question,
    question => question.user,
    { nullable: true },
  )
  questions?: Question[];
}
