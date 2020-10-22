import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applicationStatus } from 'src/application/dto/ApplicationStatus.enum';
import { Post } from 'src/post/post.entity';
import { Repository } from 'typeorm';
import { Certificate } from './certificate.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async create(post: Post, userId: number) {
    try {
      if (post.userId !== userId) throw new UnauthorizedException();
      const { title, host, recognizedHours, date } = post;
      post.applications.forEach(async application => {
        if (application.status === applicationStatus.accepted) {
          const userId = application.userId;
          const newCertificate = this.certificateRepository.create({
            title,
            host,
            recognizedHours,
            date,
            userId,
          });
          await this.certificateRepository.save(newCertificate);
        }
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
