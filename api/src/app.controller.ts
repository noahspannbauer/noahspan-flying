import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService, AuthService } from '@noahspan/noahspan-modules';
import { FeatureFlagValue } from '@azure/app-configuration';

@Controller()
export class AppController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly authService: AuthService
  ) {}

  @Get('featureFlag')
  async getFeatureFlag(@Query() query: any): Promise<FeatureFlagValue[]> {
    try {
      const token: string = await this.authService.getToken(
        'client_credentials',
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://azconfig.io'
      );
      const featureFlags: FeatureFlagValue[] =
        await this.appConfigService.getFeatureFlags(
          token,
          `${query.key}`,
          query.label
        );

      return featureFlags;
    } catch (error) {
      console.log(error);
    }
  }
}
