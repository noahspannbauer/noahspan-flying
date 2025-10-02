import {
  Controller,
  Get,
  HttpException,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { CustomError } from 'src/error/customError';


@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService
  ) {}

 
  @Get()
  async isHealthy(): Promise<boolean> {
    try {
      return await this.healthService.isDatabaseConnected();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
