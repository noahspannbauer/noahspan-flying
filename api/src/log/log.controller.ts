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
import { LogEntity } from './log.entity';
import { LogService } from './log.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@noahspan/noahspan-modules';
import { LogInterceptor } from './log.interceptor';
import { FileService } from '../file/file.service';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

@Controller('logs')
@UseInterceptors(new LogInterceptor())
// @UseGuards(AuthGuard)
export class LogController {
  constructor(
    private readonly fileService: FileService,
    private readonly logService: LogService
  ) {}

 
  @Get(':id')
  async find(
    @Param('id') id: string,
  ): Promise<LogEntity> {
    try {
      console.log(id)
      return await this.logService.find(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  async findAll(): Promise<LogEntity[]> {
    try {
      return await this.logService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  
  @Post()
  async create(@Body() logDto: LogDto): Promise<InsertResult> {
    try {
      return await this.logService.create(logDto);
    } catch (error) {
      const customError = error as CustomError;
      console.log(error)
      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() logDto: LogDto
  ): Promise<UpdateResult> {
    try {
      console.log(id)
      console.log(logDto)
      return await this.logService.update(id, logDto);
    } catch (error) {
      const customError = error as CustomError;
      console.log(error)
      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    try {
      return await this.logService.delete(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
