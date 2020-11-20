import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { applicationStatus } from 'src/application/dto/applicationStatus.enum';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async findOneByIds(userId: number, postId: number) {
    return await this.applicationRepository.findOne({
      where: { userId, postId },
    });
  }

  async create(user: User, post: Post) {
    const newApplication = this.applicationRepository.create({
      user,
      post,
    });
    await this.applicationRepository.save(newApplication);
  }

  async setStatus(status: applicationStatus, application: Application) {
    application.status = status;
    await this.applicationRepository.save(application);
  }

  async deleteAll(applications: Application[]) {
    applications.forEach(
      async application => await this.applicationRepository.remove(application),
    );
  }

  async findAllByUserId(userId: number, relations?: string[]) {
    if (relations) {
      return await this.applicationRepository.find({
        where: { userId },
        relations: [...relations],
      });
    } else {
      return await this.applicationRepository.find({
        where: { userId },
      });
    }
  }

  async findOneById(id: number) {
    return await this.applicationRepository.findOne(id);
  }

  async findAllByPostId(postId: number, relations?: string[]) {
    if (relations) {
      return await this.applicationRepository.find({
        where: { postId },
        relations: [...relations],
      });
    } else {
      return await this.applicationRepository.find({
        where: { postId },
      });
    }
  }

  async delete(application: Application) {
    await this.applicationRepository.remove(application);
  }
}
