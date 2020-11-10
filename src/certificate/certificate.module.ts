import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';
import { UserModule } from 'src/user/user.module';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Post]), UserModule],
  providers: [CertificateService, PostService],
})
export class CertificateModule {}
