import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

const httpsOptions = {
  key: readFileSync('./secrets/private.pem'),
  cert: readFileSync('./secrets/private.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
