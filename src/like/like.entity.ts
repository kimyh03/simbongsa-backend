import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 봉사활동 모집 공고의 좋아요&북마크

@ObjectType()
@Entity('Like')
export class Like {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

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
