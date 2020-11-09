import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2000000 } }))
  async uploadFile(@UploadedFile() file) {
    try {
      const data = await this.uploadService.upload(file);
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
