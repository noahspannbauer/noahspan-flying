import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { LogDto } from './log.dto';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@nestjs/passport';


@Controller('logs')
@UseGuards(AuthGuard('azure-ad'))
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

  // @Public()
  @Get()
  async findAll(): Promise<Log[]> {
    try {
      return await this.logService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

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
