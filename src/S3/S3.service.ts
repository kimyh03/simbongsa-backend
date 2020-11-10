import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
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
    const key = `avatar/${date + originalname}`;
    return {
      ACL: 'public-read',
      Bucket: bucket,
      Key: key,
      Body: buffer,
    };
  }

  async upload(file) {
    try {
      const s3 = this.getS3();
      const params = this.getParams(file);
      await s3.putObject(params).promise();
      return params.Key;
    } catch (error) {
      console.log(error.message);
    }
  }

  async delete(key: string) {
    try {
      const s3 = this.getS3();
      const params = {
        Bucket: 'simbongsa1365',
        Key: `avatar${key}`,
      };
      console.log(params.Key);
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.log(error.message);
    }
  }
}
