import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const httpService = new HttpService();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  httpService.axiosRef.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Internal server error exception', error);

      throw new InternalServerErrorException();
    }
  );

  await app.listen(3000);
}
bootstrap();
