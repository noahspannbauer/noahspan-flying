import {
  Controller,
  Get,
  HttpStatus,
} from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  async isHealthy(): Promise<HttpStatus> {
    return HttpStatus.OK
  }
}
