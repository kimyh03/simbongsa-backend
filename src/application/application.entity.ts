import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

// 봉사활동 모집 공고에 대한 참가 신청

@ObjectType()
@Entity('Application')
export class Application extends CoreEntity {
  // 참가 신청의 수락여부
  @Field()
  @Column({ default: false })
  isAccepted: boolean;

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

  @Field()
  @RelationId((application: Application) => application.post)
  @Column()
  postId: number;
}
