import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(excpetion: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = excpetion.getStatus();
    console.log(excpetion.cause);

    response.status(status).json({
      name: excpetion.cause,
      message: excpetion.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
