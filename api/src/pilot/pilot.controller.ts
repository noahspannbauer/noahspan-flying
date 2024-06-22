import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Public } from '@noahspan/noahspan-modules';
import { PilotDTO } from './pilot.dto';
import { Pilot } from './pilot.entity';

@Controller('pilots')
export class PilotController {
  constructor() {}

  @Public()
  @Post()
  async createPilot(@Body() pilotDto: PilotDTO) {
    const pilot = new Pilot();
    Object.assign(pilot, pilotDto);

    console.log(pilot);
  }
}
