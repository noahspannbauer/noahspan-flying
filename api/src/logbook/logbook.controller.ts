import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { LogbookService } from './logbook.service';
import { LogbookDto } from './logbook.dto';
import { CustomError } from '../customError/CustomError';
import { TableInsertEntityHeaders } from '@azure/data-tables';
import { LogbookEntity } from './logbook.entity';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Get(':entryId')
  async find(@Param() params: any): Promise<LogbookEntity> {
    try {
      const entry: LogbookEntity = await this.logbookService.find(
        params.entryId
      );

      return entry;
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Get()
  async findAll(): Promise<LogbookEntity[]> {
    try {
      const logbookEntries: LogbookEntity[] =
        await this.logbookService.findAll();

      return logbookEntries;
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Post()
  async create(@Body() logbookData: LogbookDto): Promise<void> {
    try {
      const response: TableInsertEntityHeaders =
        await this.logbookService.create(logbookData);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Put(':entryId')
  async update(
    @Param() params: any,
    @Body() logbookData: LogbookDto
  ): Promise<void> {
    try {
      return await this.logbookService.update(logbookData);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Delete(':rowKey')
  async delete(@Param() params: any): Promise<void> {
    try {
      await this.logbookService.delete(params.rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }
}
