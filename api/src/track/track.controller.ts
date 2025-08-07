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
  // async fin(@Param('id') id: string): Promise<TrackEntity> {
  //   try {
  //     return await this.trackService.find(id);
  //   } catch (error) {
  //     const customError = error as CustomError;

  //     throw new HttpException(customError.message, customError.statusCode);
  //   }
  // }

  // @Get()
  // async findAdd(): Promise<TrackEntity[]> {
  //   try {
  //     return await this.trackService.findAll();
  //   } catch (error) {
  //     const customError = error as CustomError;

  //     throw new HttpException(customError.message, customError.statusCode)
  //   }
  // }

  @Post(':logId/:order')
  async create(@Param('logId') logId: string, @Param('order') order: number, @UploadedFile() file: Express.Multer.File): Promise<InsertResult> {
    try {
      console.log(file)
      return await this.trackService.create(logId, order, file);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() trackDto: TrackDto): Promise<UpdateResult> {
  //   try {
  //     return await this.trackService.update(id, trackDto);
  //   } catch (error) {
  //     const customError = error as CustomError;

  //     throw new HttpException(customError.message, customError.statusCode)
  //   }
  // }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.trackService.delete(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':partitionKey/:rowKey/track')
  @UseInterceptors(FileInterceptor('file'))
  async createTrack(@Param('rowKey') rowKey: string, @UploadedFile() file: Express.Multer.File) {
    try {
      const containerName = 'tracks';
      const url = await this.fileService.uploadFile(file, containerName, rowKey);
  
      return { url }
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get(':partitionKey/:rowKey/track')
  async downloadTrack(@Param('rowKey') rowKey: string, @Query('fileName') fileName: string): Promise<string> {
    const containerName = 'tracks';
    const downloadedFile: string = await this.fileService.downloadFile(containerName, rowKey, fileName)

    return downloadedFile;
  }

  @UseGuards(AuthGuard)
  @Delete(':partitionKey/:rowKey/track')
  async deleteTrack(@Param('rowKey') rowKey: string, @Query('fileName') fileName: string): Promise<void> {
    try {
      const containerName = 'tracks';
      
      return await this.fileService.deleteFile(containerName, rowKey, fileName)
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}









