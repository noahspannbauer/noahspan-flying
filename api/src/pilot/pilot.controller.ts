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
  UseInterceptors,
} from '@nestjs/common';
import { PilotDto } from './pilot.dto';
import { PilotEntity } from './pilot.entity';
import { PilotService } from './pilot.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@noahspan/noahspan-modules'
import { PilotInterceptor } from './interceptors/pilot.interceptor';

@Controller('pilots')
// @UseInterceptors(new PilotInterceptor())
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get(':id')
  async find(@Param('id') id: string) {
    try {
      return await this.pilotService.find(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.pilotService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  // @UseGuards(AuthGuard)
  @Post()
  async create(@Body() pilotDto: PilotDto) {
    try {
      return await this.pilotService.create(pilotDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  // @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() pilotDto: PilotDto
  ) {
    try {
      return await this.pilotService.update(id, pilotDto);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    try {
      return await this.pilotService.delete(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
