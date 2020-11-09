import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}
  getS3() {
    return new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: 'ap-northeast-2',
    });
  }

  getParams(file) {
    const bucket = 'simbongsa1365';
    const { buffer, originalname } = file;
    const date = Date.now().toString();
    const urlKey = `avatar/${date + originalname}`;
    return {
      ACL: 'public-read',
      Bucket: bucket,
      Key: urlKey,
      Body: buffer,
    };
  }

  async upload(file) {
    try {
      const s3 = this.getS3();
      const params = this.getParams(file);
      const data = await s3
        .putObject(params)
        .promise()
        .then(
          () => {
            return params.Key;
          },
          err => {
            return err;
          },
        );
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}
