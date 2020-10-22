import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Brackets, Repository } from 'typeorm';
import { CreatePostInput } from './dto/CreatePost.dto';
import { EditPostInput } from './dto/EditPost.dto';
import { GetPostsInput } from './dto/GetPosts.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOneById(id: number, relations?: string[]) {
    try {
      if (relations) {
        const post = await this.postRepository.findOne({
          where: { id },
          relations: [...relations],
        });
        if (!post) throw new NotFoundException();
        return { error: null, post };
      } else {
        const post = await this.postRepository.findOne(id);
        if (!post) throw new NotFoundException();
        return { error: null, post };
      }
    } catch (error) {
      return { error: error.message, post: null };
    }
  }

  async createPost(userId: number, data: CreatePostInput) {
    try {
      const { user, error } = await this.userService.findOneById(userId);
      if (error) throw new Error(error);
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
      const post = await this.postRepository.findOne(postId);
      if (!post) throw new NotFoundException();
      if (post.userId !== userId) throw new UnauthorizedException();
      await this.postRepository.remove(post);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }
  async findByFilter({
    categories,
    rigions,
    openOnly,
    page = 1,
    searchTerm,
  }: GetPostsInput) {
    try {
      const OFFSET = (page - 1) * 10;
      if (searchTerm) {
        const posts = await this.postRepository
          .createQueryBuilder('post')
          .andWhere('post.isOpened =:openOnly', { openOnly })
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions })
          .andWhere(
            new Brackets(qb => {
              qb.where('post.title LIKE :title', {
                title: `%${searchTerm}%`,
              }).orWhere('post.description like :description', {
                description: `%${searchTerm}%`,
              });
            }),
          )
          .orderBy('post.id', 'DESC')
          .take(10)
          .offset(OFFSET)
          .getMany();
        const totalCount = await this.postRepository
          .createQueryBuilder('post')
          .andWhere('post.isOpened =:openOnly', { openOnly })
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions })
          .andWhere(
            new Brackets(qb => {
              qb.where('post.title LIKE :title', {
                title: `%${searchTerm}%`,
              }).orWhere('post.description like :description', {
                description: `%${searchTerm}%`,
              });
            }),
          )
          .orderBy('post.id', 'DESC')
          .getCount();
        const totalPage = Math.ceil(totalCount / 10);
        return { error: null, posts, totalCount, totalPage };
      } else {
        const posts = await this.postRepository
          .createQueryBuilder('post')
          .andWhere('post.isOpened =:openOnly', { openOnly })
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions })
          .orderBy('post.id', 'DESC')
          .take(10)
          .offset(OFFSET)
          .getMany();
        const totalCount = await this.postRepository
          .createQueryBuilder('post')
          .andWhere('post.isOpened =:openOnly', { openOnly })
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions })
          .orderBy('post.id', 'DESC')
          .getCount();
        const totalPage = Math.ceil(totalCount / 10);
        return { error: null, posts, totalCount, totalPage };
      }
    } catch (error) {
      return { error };
    }
  }

  async setIsCompleteTrue(postId: number, userId: number) {
    try {
      const post = await this.postRepository.findOne(postId);
      if (!post) throw new NotFoundException();
      if (post.userId !== userId) throw new UnauthorizedException();
      post.isCompleted = true;
      await this.postRepository.save(post);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
