import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/CreatePost.dto';
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
}
