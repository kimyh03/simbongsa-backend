import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Brackets, Repository } from 'typeorm';
import { CreatePostInput } from './dto/CreatePost.dto';
import { GetPostsInput } from './dto/GetPosts.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOneById(id: number, relations?: string[]) {
    if (relations) {
      return await this.postRepository.findOne({
        where: { id },
        relations: [...relations],
      });
    } else {
      return await this.postRepository.findOne(id);
    }
  }

  async createPost(user: User, data: CreatePostInput) {
    const newPost = this.postRepository.create({ user, ...data });
    await this.postRepository.save(newPost);
  }

  async toggleOpenAndClose(post: Post) {
    post.isOpened = !post.isOpened;
    await this.postRepository.save(post);
  }

  async delete(post: Post) {
    await this.postRepository.remove(post);
  }

  async findByFilter({
    categories,
    rigions,
    openOnly,
    page = 1,
    searchTerm,
  }: GetPostsInput) {
    const LIMIT = 10;
    const OFFSET = (page - 1) * LIMIT;
    const baseQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.applications', 'applications')
      .orderBy('post.id', 'DESC')
      .limit(LIMIT)
      .offset(OFFSET);
    const serchQuery = baseQuery.andWhere(
      new Brackets(qb => {
        qb.where('post.title LIKE :title', {
          title: `%${searchTerm}%`,
        }).orWhere('post.description like :description', {
          description: `%${searchTerm}%`,
        });
      }),
    );
    let query;
    const makeResponse = async query => {
      const [posts, totalCount] = await query.getManyAndCount();
      const totalPage = Math.ceil(totalCount / 10);
      return { posts, totalCount, totalPage };
    };
    if (!searchTerm) {
      if (categories.length === 0 && rigions.length === 0) {
        query = baseQuery;
      } else if (categories && rigions.length === 0) {
        query = baseQuery.andWhere('post.category IN (:...categories)', {
          categories,
        });
      } else if (categories.length === 0 && rigions) {
        query = baseQuery.andWhere('post.rigion IN (:...rigions)', {
          rigions,
        });
      } else {
        query = baseQuery
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions });
      }
    } else {
      if (categories.length === 0 && rigions.length === 0) {
        query = serchQuery;
      } else if (categories && rigions.length === 0) {
        query = serchQuery.andWhere('post.category IN (:...categories)', {
          categories,
        });
      } else if (categories.length === 0 && rigions) {
        query = serchQuery.andWhere('post.rigion IN (:...rigions)', {
          rigions,
        });
      } else {
        query = serchQuery
          .andWhere('post.category IN (:...categories)', { categories })
          .andWhere('post.rigion IN (:...rigions)', { rigions });
      }
    }
    if (openOnly) {
      query = query.andWhere('post.isOpened =:openOnly', { openOnly });
    }
    const { posts, totalCount, totalPage } = await makeResponse(query);
    return { posts, totalCount, totalPage };
  }

  async setIsCompleteTrue(post: Post) {
    post.isCompleted = true;
    post.isOpened = false;
    await this.postRepository.save(post);
    return { error: null };
  }
}
