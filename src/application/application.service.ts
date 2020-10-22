import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { applicationStatus } from './dto/ApplicationStatus.enum';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async findOneByIds(userId: number, postId: number) {
    try {
      const application = await this.applicationRepository.findOne({
        where: { userId, postId },
      });
      return {
        application,
        error: null,
      };
    } catch (error) {
      return {
        application: null,
        error,
      };
    }
  }

  async create(userId: number, postId: number) {
    try {
      const isExist = await this.applicationRepository.findOne({
        where: { userId, postId },
      });
      if (isExist) throw new Error('이미 신청하셨습니다.');
      const { user, error: uError } = await this.userService.findOneById(
        userId,
      );
      const { post, error: pError } = await this.postService.findOneById(
        postId,
      );
      if (uError) throw new Error(uError);
      if (pError) throw new Error(pError);
      if (post.isCompleted === true || post.isOpened === false)
        throw new Error('모집이 마감 되었습니다.');
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

  async setStatus(
    status: applicationStatus,
    applicationId: number,
    userId: number,
  ) {
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
      application.status = status;
      await this.applicationRepository.save(application);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async deleteByPostId(postId: number, userId: number) {
    try {
      const application = await this.applicationRepository.findOne({
        where: { postId, userId },
      });
      if (!application) throw new NotFoundException();
      if (application.userId === userId) {
        await this.applicationRepository.remove(application);
        return { error: null };
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      return { error };
    }
  }

  async deleteAllOfPost(post: Post, userId: number) {
    try {
      if (post.userId !== userId) throw new UnauthorizedException();
      post.applications.forEach(
        async application =>
          await this.applicationRepository.remove(application),
      );
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const applications = await this.applicationRepository.find({
        where: { userId },
        relations: ['post'],
      });
      if (!applications) throw new NotFoundException();
      return { applications, error: null };
    } catch (error) {
      return { applications: null, error };
    }
  }
}
