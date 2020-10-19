import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Like } from 'src/like/like.entity';
import { Question } from 'src/question/question.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

enum postCategory {
  environment,
  eventSupport,
  communityService,
  ruralAtivity,
}

registerEnumType(postCategory, { name: 'postCategory' });

// 봉사활동 모집 공고

@ObjectType()
@Entity('Post')
export class Post extends CoreEntity {
  //모집 공고 제목
  @Field()
  @Column()
  title: string;

  // 모집 공고 세부설명
  @Field()
  @Column()
  description: string;

  // 모집 공고 카테고리(환경보호 || 행사지원 || 생활지원 || 농어촌활동)
  @Field(() => postCategory)
  @Column({ type: 'enum', enum: postCategory })
  category: postCategory;

  // 활동 날짜
  @Field()
  @Column()
  date: Date;

  // 활동 장소
  @Field()
  @Column()
  adress: string;

  // 활동 모집 주최
  @Field()
  @Column()
  host: string;

  // 모집 인원
  @Field()
  @Column()
  NumOfRecruitment: number;

  // 봉사활동 시간
  @Field()
  @Column()
  recognizedHours: number;

  // 인원 모집 여부(false시 참가 신청 불가)
  @Field()
  @Column({ default: true })
  isOpened: boolean;

  // 활동 종료 여부(true시 참가자의 봉사활동 이력 및 봉사시간에 추가, 모집공고 삭제 불가, 참가신청 불가)
  @Field()
  @Column({ default: false })
  isCompleted: boolean;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.posts,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field()
  @RelationId((post: Post) => post.user)
  @Column()
  userId: number;

  @Field(() => [Application], { nullable: true })
  @OneToMany(
    () => Application,
    appication => appication.post,
    { nullable: true },
  )
  applications?: Application[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(
    () => Like,
    like => like.post,
    { nullable: true },
  )
  likes?: Like[];

  @Field(() => [Question], { nullable: true })
  @OneToMany(
    () => Question,
    question => question.post,
    { nullable: true },
  )
  questions?: Question[];
}
