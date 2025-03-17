import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { LogDto } from './log.dto';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@noahspan/noahspan-modules';
import { LogInterceptor } from './interceptors/log.interceptor';


@Controller('logs')
@UseInterceptors(new LogInterceptor())
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get(':partitionKey/:rowKey')
  async find(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string
  ): Promise<Log> {
    try {
      return await this.logService.find(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  async findAll(): Promise<Log[]> {
    try {
      return await this.logService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() logDto: LogDto): Promise<Log> {
    try {
      const log = new Log();

      Object.assign(log, logDto);

      return await this.logService.create(log);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)  
  @Put(':partitionKey/:rowKey')
  async update(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string,
    @Body() logDto: LogDto
  ): Promise<Log> {
    try {
      const log = new Log();

      Object.assign(log, logDto);

      return await this.logService.update(partitionKey, rowKey, log);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':partitionKey/:rowKey')
  async delete(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string
  ): Promise<void> {
    try {
      return await this.logService.delete(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
