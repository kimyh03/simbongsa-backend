import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Entity, ManyToOne } from 'typeorm';

// 봉사활동 모집 공고의 좋아요&북마크

@ObjectType()
@Entity('Like')
export class Like extends CoreEntity {
  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.likes,
    { onDelete: 'CASCADE' },
  )
  user: User;

  @Field(() => Post)
  @ManyToOne(
    () => Post,
    post => post.likes,
    { onDelete: 'CASCADE' },
  )
  post: Post;
}
