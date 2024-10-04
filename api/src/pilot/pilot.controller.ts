import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { PilotInfoService } from './info/pilot-info.service';
import { PilotInfoDto } from './info/pilot-info.dto';
import { TableInsertEntityHeaders } from '@azure/data-tables';
import { CustomError } from '../customError/CustomError';
import { PilotInfoEntity } from './info/pilot-info.entity';
import { PilotInterceptor } from 'src/pilot/interceptors/pilot.interceptor';
import { Public } from '@noahspan/noahspan-modules';

@Controller('pilots')
export class PilotController {
  constructor(private readonly pilotInfoService: PilotInfoService) {}

  @Get(':pilotId')
  @Public()
  @UseInterceptors(PilotInterceptor)
  async find(@Param() params: any): Promise<PilotInfoEntity> {
    try {
      const pilot: PilotInfoEntity = await this.pilotInfoService.find(
        params.pilotId
      );

      return pilot;
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Get()
  @Public()
  @UseInterceptors(PilotInterceptor)
  async findAll(): Promise<PilotInfoEntity[]> {
    try {
      const pilots: PilotInfoEntity[] = await this.pilotInfoService.findAll();

      return pilots;
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }

  @Post()
  async create(@Body() pilotInfoData: PilotInfoDto): Promise<void> {
    try {
      const response: TableInsertEntityHeaders =
        await this.pilotInfoService.create(pilotInfoData);
    } catch (error) {
      const customError = error as CustomError;

      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });
    }
  }
}
