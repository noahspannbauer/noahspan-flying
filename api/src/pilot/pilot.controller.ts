import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PilotDto } from './pilot.dto';
import { Pilot } from './pilot.entity';
import { PilotService } from './pilot.service';
import { CustomError } from '../error/customError';
import { Public } from '@noahspan/noahspan-modules'
import { PilotInterceptor } from './interceptors/pilot.interceptor';

@Controller('pilots')
@UseInterceptors(new PilotInterceptor())
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Public()
  @Get(':partitionKey/:rowKey')
  async find(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string
  ) {
    try {
      return await this.pilotService.find(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Public()
  @Get()
  async findAll() {
    try {
      return await this.pilotService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Post()
  async create(@Body() pilotDto: PilotDto) {
    try {
      const pilot = new Pilot();

      Object.assign(pilot, pilotDto);

      return await this.pilotService.create(pilot);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Put(':partitionKey/:rowKey')
  async update(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string,
    @Body() pilotDto: PilotDto
  ) {
    try {
      const pilot = new Pilot();

      Object.assign(pilot, pilotDto);

      return await this.pilotService.update(partitionKey, rowKey, pilot);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Delete(':partitionKey/:rowKey')
  async delete(
    @Param('partitionKey') partitionKey: string,
    @Param('rowKey') rowKey: string
  ) {
    try {
      return await this.pilotService.delete(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
