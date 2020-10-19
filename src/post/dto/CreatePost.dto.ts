import { InputType, PickType } from '@nestjs/graphql';
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
