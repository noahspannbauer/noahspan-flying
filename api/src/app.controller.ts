import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzAppConfigService } from '@noahspan/noahspan-modules';

@Controller()
export class AppController {
  constructor(private readonly azAppConfigService: AzAppConfigService) {}

  @Get('featureFlag')
  getFeatureFlag(key: string, label: string): string {
    const featureFlag = this.azAppConfigService.getFeatureFlag(key, label);
    console.log(process.env.AZ_APP_CONFIG_CONNECTION_STRING);
    return 'blah';
  }
}
