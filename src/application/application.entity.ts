import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { applicationStatus } from './dto/ApplicationStatus.enum';

// 봉사활동 모집 공고에 대한 참가 신청

registerEnumType(applicationStatus, { name: 'applicationStatus' });

@ObjectType()
@Entity('Application')
export class Application extends CoreEntity {
  // 참가 신청의 수락여부
  @Field()
  @Column({
    type: 'enum',
    enum: applicationStatus,
    default: applicationStatus.pendding,
  })
  status: applicationStatus;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.applications,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field()
  @RelationId((application: Application) => application.user)
  @Column()
  userId: number;

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
