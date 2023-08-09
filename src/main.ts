import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'https://pyshop-intern-frontend.vercel.app',
      'http://192.168.1.246:9000',
      'http://localhost:9000',
      'http://194.58.90.28:9000',
      'http://194.58.90.28',
    ],
    exposedHeaders: ['X-Set-Cookie', 'Set-Cookie'],
  });
  await app.listen(3000);
}
bootstrap();
