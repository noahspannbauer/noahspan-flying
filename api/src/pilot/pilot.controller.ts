import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { PilotInfoService } from './info/pilot-info.service';
import { PilotInfoDto } from './info/pilot-info.dto';
import { TableInsertEntityHeaders } from '@azure/data-tables';
import { CustomError } from '../customError/CustomError';

@Controller('pilots')
export class PilotController {
  constructor(private readonly pilotInfoService: PilotInfoService) {}

  @Post()
  async createPilot(@Body() pilotInfoData: PilotInfoDto): Promise<void> {
    try {
      const response: TableInsertEntityHeaders =
        await this.pilotInfoService.create(pilotInfoData);

      console.log(`Not Broken: ${response}`);
    } catch (error) {
      const customError = error as CustomError;
      console.log(customError.name);
      throw new HttpException(customError.message, customError.statusCode, {
        cause: customError.name
      });

      // throw new HttpException({
      //   status: customError.statusCode,
      //   error: customError.message
      // }, customError.statusCode, {
      //   cause: customError.name
      // });
    }
  }
}
