import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/application/application.entity';
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

  async create(post: Post, applications: Application[]) {
    const { title, host, recognizedHours, date } = post;
    applications.forEach(async application => {
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
  }

  async findAllByUserId(userId: number) {
    return await this.certificateRepository.find({
      where: { userId },
    });
  }
}
