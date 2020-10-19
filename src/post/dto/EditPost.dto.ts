import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './CreatePost.dto';

@InputType()
export class EditPostInput extends PartialType(CreatePostInput) {}
