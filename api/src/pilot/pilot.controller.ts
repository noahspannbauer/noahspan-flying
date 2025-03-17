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
import { Pilot } from './pilot.entity';
import { PilotService } from './pilot.service';
import { CustomError } from '../error/customError';
import { AuthGuard } from '@noahspan/noahspan-modules'
import { PilotInterceptor } from './interceptors/pilot.interceptor';

@Controller('pilots')
@UseInterceptors(new PilotInterceptor())
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

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

  @Get()
  async findAll() {
    try {
      return await this.pilotService.findAll();
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() pilotDto: PilotDto) {
    try {
      let pilot = new Pilot();
      
      pilot = {
        partitionKey: pilotDto.partitionKey,
        rowKey: pilotDto.rowKey,
        id: pilotDto.id,
        name: pilotDto.name,
        address: pilotDto.address,
        city: pilotDto.city,
        state: pilotDto.state,
        postalCode: pilotDto.postalCode,
        email: pilotDto.email,
        phone: pilotDto.phone,
        medicalClass: pilotDto.medicalClass,
        medicalExpiration: pilotDto.medicalExpiration,
        certificates: JSON.stringify(pilotDto.certificates),
        endorsements: JSON.stringify(pilotDto.endorsements)
      }

      return await this.pilotService.create(pilot);
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
    @Body() pilotDto: PilotDto
  ) {
    try {
      let pilot = new Pilot();

      pilot = {
        partitionKey: pilotDto.partitionKey,
        rowKey: pilotDto.rowKey,
        id: pilotDto.id,
        name: pilotDto.name,
        address: pilotDto.address,
        city: pilotDto.city,
        state: pilotDto.state,
        postalCode: pilotDto.postalCode,
        email: pilotDto.email,
        phone: pilotDto.phone,
        medicalClass: pilotDto.medicalClass,
        medicalExpiration: pilotDto.medicalExpiration,
        certificates: JSON.stringify(pilotDto.certificates),
        endorsements: JSON.stringify(pilotDto.endorsements)
      }

      return await this.pilotService.update(partitionKey, rowKey, pilot);
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
  ) {
    try {
      return await this.pilotService.delete(partitionKey, rowKey);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode);
    }
  }
}
