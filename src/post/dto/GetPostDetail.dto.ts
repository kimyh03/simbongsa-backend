import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/application.entity';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Question } from 'src/question/question.entity';
import { Post } from '../post.entity';

@InputType()
export class GetPostDetailInput {
  @Field()
  postId: number;
}

@ObjectType()
export class GetPostDetailOutput extends CommonOutput {
  @Field({ nullable: true })
  post?: Post;

  @Field(() => [Question], { nullable: true })
  questions?: Question[];

  @Field(() => [Application], { nullable: true })
  applications?: Application[];

  // 본인이 작성한 모집공고 여부(client에서 사용, true시 모집공고 수정 및 삭제 버튼 등 추가 )
  @Field({ defaultValue: false })
  isMine?: boolean;

  // 좋아요&북마크 등록 여부(client에서 사용, Like여부에 따라 모집공고 상세화면에서 다른 아이콘 출력 ex)실선하트 or 색칠하트)
  @Field({ defaultValue: false })
  isLiked?: boolean;

  // 참가신청여부(client에서 사용, apply여부에 따라 참가신청 || 신청취소 버튼 출력)
  @Field({ defaultValue: false })
  isApplied?: boolean;
}
