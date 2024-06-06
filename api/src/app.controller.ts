import { Controller, Get, Query } from '@nestjs/common';
import {
  AppConfigService,
  MsGraphService,
  MsGraphClient
} from '@noahspan/noahspan-modules';
import { FeatureFlagValue } from '@azure/app-configuration';
import { Public } from '@noahspan/noahspan-modules';

@Controller()
export class AppController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly msGraphService: MsGraphService
  ) {}

  @Public()
  @Get('featureFlags')
  async getFeatureFlags(@Query() query: any): Promise<FeatureFlagValue[]> {
    console.log(process.env.CLIENT_ID);
    try {
      const token: string = await this.appConfigService.getToken();
      const featureFlags: FeatureFlagValue[] =
        await this.appConfigService.getFeatureFlags(
          token,
          `${query.key}`,
          query.label
        );

      return featureFlags;
    } catch (error) {
      return error;
    }
  }

  @Public()
  @Get('profilePhoto')
  async getProfilePhoto(@Query() query: any): Promise<any> {}

  @Get('userProfile')
  async getUserProfile(@Query() query: any) {
    try {
      const username: string = query.username;
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClient();
      const userProfile = await client.api(`users/${username}`).get();

      return userProfile;
    } catch (error) {
      return error;
    }
  }
}
