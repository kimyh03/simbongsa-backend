import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { Certificate } from './certificate.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly postService: PostService,
  ) {}

  async findAll() {
    return await this.certificateRepository.find();
  }

  async create(postId: number, userId: number) {
    try {
      const { post, error } = await this.postService.findOneById(postId, [
        'applications',
      ]);
      if (error) throw new Error(error);
      if (!post) throw new NotFoundException();
      if (post.userId !== userId) throw new UnauthorizedException();
      const { title, host, recognizedHours, date } = post;
      await post.applications.forEach(async application => {
        const userId = application.userId;
        const newCertificate = this.certificateRepository.create({
          title,
          host,
          recognizedHours,
          date,
          userId,
        });
        await this.certificateRepository.save(newCertificate);
      });
      return { error: null };
    } catch (error) {
      return {
        error,
      };
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const certificates = await this.certificateRepository.find({
        where: { userId },
      });
      return { certificates, error: null };
    } catch (error) {
      return { error, certificates: null };
    }
  }
}
