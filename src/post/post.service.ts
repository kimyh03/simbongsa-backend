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
    try {
      const post = await this.postRepository.findOne(id);
      if (!post) throw new NotFoundException();
      return { error: null, post };
    } catch (error) {
      return { error: error.message, post: null };
    }
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
      const { error, post } = await this.findOneById(postId);
      if (error) throw new Error(error);
      if (post.userId !== userId) throw new UnauthorizedException();
      Object.assign(post, data);
      await this.postRepository.save(post);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async toggleOpenAndClose(userId: number, postId: number) {
    try {
      const { error, post } = await this.findOneById(postId);
      if (error) throw new Error(error);
      if (post.userId !== userId) throw new UnauthorizedException();
      post.isOpened = !post.isOpened;
      await this.postRepository.save(post);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const posts = await this.postRepository.find({ where: { userId } });
      return { posts, error: null };
    } catch (error) {
      return { posts: null, error: error.message };
    }
  }

  async delete(userId: number, postId: number) {
    try {
      const { error, post } = await this.findOneById(postId);
      if (error) throw new Error(error);
      if (post.userId !== userId) throw new UnauthorizedException();
      await this.postRepository.remove(post);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
