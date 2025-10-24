import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@noahspan/noahspan-modules';
import { CustomError } from '../error/customError';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TrackDto } from './track.dto';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

@Controller('tracks')
export class TrackController {
  constructor(
    private readonly fileService: FileService,
    private readonly trackService: TrackService
  ) {}

  // @Get('id')
  // async find(@Param('id') id: string): Promise<TrackEntity> {
  //   try {
  //     return await this.trackService.find(id);
  //   } catch (error) {
  //     const customError = error as CustomError;

  //     throw new HttpException(customError.message, customError.statusCode);
  //   }
  // }

  @UseGuards(AuthGuard)
  @Get(':logId')
  async findAll(@Param('logId') logId: string): Promise<TrackEntity[]> {
    try {
      console.log('logId: ' + logId)
      return await this.trackService.findAll(logId);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':logId/:order')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Param('logId') logId: string, @Param('order') order: number, @UploadedFile() file: Express.Multer.File): Promise<InsertResult> {
    try {
      return await this.trackService.create(logId, order, file);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Query('fileName') fileName: string, @Query('logId') logId: string): Promise<DeleteResult> {
    try {

      return await this.trackService.delete(id, logId, fileName);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get(':logId/:fileName')
  async downloadTrack(@Param('logId') logId: string, @Param('fileName') fileName: string): Promise<string> {
    try {
      return await this.trackService.downloadTrackFile(logId, fileName);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}





