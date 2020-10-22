import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Post } from '../post.entity';

@InputType()
export class CreatePostInput extends PickType(
  Post,
  [
    'title',
    'description',
    'category',
    'rigion',
    'adress',
    'host',
    'NumOfRecruitment',
    'recognizedHours',
    'date',
  ],
  InputType,
) {}

@ObjectType()
export class CreatePostOutput extends CommonOutput {}
