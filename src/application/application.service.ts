import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async findAll() {
    return await this.applicationRepository.find({
      relations: ['post', 'user'],
    });
  }

  async create(userId: number, postId: number) {
    try {
      const { user, error: uError } = await this.userService.findOneById(
        userId,
      );
      const { post, error: pError } = await this.postService.findOneById(
        postId,
      );
      if (uError) throw new Error(uError);
      if (pError) throw new Error(pError);
      const newApplication = this.applicationRepository.create({
        user,
        post,
      });
      await this.applicationRepository.save(newApplication);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async;
}
