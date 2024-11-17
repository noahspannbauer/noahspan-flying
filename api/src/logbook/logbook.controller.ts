import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { LogbookService } from './logbook.service';
import { LogbookDto } from './logbook.dto';
import { CustomError } from '../customError/CustomError';
import { TableInsertEntityHeaders } from '@azure/data-tables';
import { LogbookEntity } from './logbook.entity';

@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  @Get()
  async findAll(): Promise<LogbookEntity[]> {
    try {
      const logbookEntries: LogbookEntity[] =
        await this.logbookService.findAll();

      return logbookEntries;
    } catch (error) {
      const customError = error as CustomError;
      console.log(error);
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
}