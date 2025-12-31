import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { InternalServerErrorException } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const httpService = new HttpService();
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : `https://${process.env.CONTAINER_APP_NAME}.${process.env.CONTAINER_APP_ENV_DNS_SUFFIX}`,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )

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
