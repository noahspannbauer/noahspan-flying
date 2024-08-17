import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UnprocessableEntityException
} from '@nestjs/common';
import { PilotInfoService } from './info/pilot-info.service';
import { PilotInfoDto } from './info/pilot-info.dto';

@Controller('pilots')
export class PilotController {
  constructor(private readonly pilotInfoService: PilotInfoService) {}

  @Post()
  async createPilot(@Body() pilotInfoData: PilotInfoDto): Promise<void> {
    try {
      return await this.pilotInfoService.create(pilotInfoData);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
