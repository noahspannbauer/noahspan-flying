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
import { PilotService } from './pilot.service';
import { CustomError } from '../error/customError';
import { PilotInterceptor } from './pilot.interceptor';
import { AuthGuard, Public } from '@noahspan/noahspan-modules';
import { Reflector } from '@nestjs/core';

const reflector = new Reflector();

@Controller('pilots')
@UseInterceptors(new PilotInterceptor(reflector))
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get(':id')
  @Public()
  async find(@Param('id') id: string) {
    try {
      return await this.pilotService.find(id);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Get()
  @Public()
  async findAll() {
    try {
      return await this.pilotService.findAll();
    } catch (error) {
      const customError = error as CustomError;
      console.log(error)
      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() pilotDto: PilotDto) {
    try {
      
      return await this.pilotService.create(pilotDto);
    } catch (error) {
      console.log(error)
      // const customError = error as CustomError;

      // throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
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

  @Delete(':id')
  @UseGuards(AuthGuard)
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
