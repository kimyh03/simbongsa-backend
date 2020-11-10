import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './S3.service';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2000000 } }))
  async uploadFile(@UploadedFile() file) {
    try {
      const data = await this.s3Service.upload(file);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  hi() {
    return 'hi';
  }
}
