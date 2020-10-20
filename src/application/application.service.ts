import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async toggleIsAccepted(applicationId: number, userId: number) {
    try {
      const application = await this.applicationRepository.findOne(
        applicationId,
      );
      if (!application) throw new NotFoundException();
      const { post, error } = await this.postService.findOneById(
        application.postId,
      );
      if (error) throw new Error(error);
      if (post.userId !== userId) throw new UnauthorizedException();
      application.isAccepted = !application.isAccepted;
      await this.applicationRepository.save(application);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
