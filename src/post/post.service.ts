import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/CreatePost.dto';
import { EditPostInput } from './dto/EditPost.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAllPosts() {
    return await this.postRepository.find();
  }

  async findOneById(id: number) {
    return await this.postRepository.findOne(id);
  }

  async createPost(userId: number, data: CreatePostInput) {
    try {
      const user = await this.userService.findOneById(userId);
      const newPost = this.postRepository.create({ user, ...data });
      await this.postRepository.save(newPost);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async editPost(userId: number, postId: number, data: EditPostInput) {
    try {
      const post = await this.findOneById(postId);
      if (!post) throw new NotFoundException();
      if (post.userId !== userId) throw new UnauthorizedException();
      Object.assign(post, data);
      await this.postRepository.save(post);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }
}
