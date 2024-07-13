import { Controller, Get, Headers, Query } from '@nestjs/common';
import {
  AppConfigService,
  MsGraphService,
  MsGraphClient
} from '@noahspan/noahspan-modules';
import { FeatureFlagValue } from '@azure/app-configuration';
import { Public } from '@noahspan/noahspan-modules';
import { Person } from '@microsoft/microsoft-graph-types';

@Controller()
export class AppController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly msGraphService: MsGraphService
  ) {}

  @Public()
  @Get('featureFlags')
  async getFeatureFlags(
    @Query() query: any
  ): Promise<{ key: string; enabled: boolean }[]> {
    try {
      const featureFlagKeys: string[] =
        query.keys && query.keys.toString().includes(';')
          ? query.keys.split(';')
          : [query.keys];
      const featureFlagLabel: string = query.label;
      const featureFlags: { key: string; enabled: boolean }[] =
        await this.appConfigService.getFeatureFlags(
          featureFlagKeys,
          featureFlagLabel
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
  async getUserProfile(@Headers() headers: any) {
    try {
      const graphToken: string = await this.msGraphService.getMsGraphAuth(
        headers.authorization.replace('Bearer ', '')
      );
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClientDelegated(graphToken);
      const userProfile = await client.api(`me`).get();

      return userProfile;
    } catch (error) {
      return error;
    }
  }

  @Get('personSearch')
  async searchUsers(
    @Headers() headers: any,
    @Query('search') search: any
  ): Promise<Person[]> {
    try {
      const graphToken: string = await this.msGraphService.getMsGraphAuth(
        headers.authorization.replace('Bearer ', '')
      );
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClientDelegated(graphToken);
      const results: any = await client
        .api(`me/people/?$search=${search}`)
        .get();
      const personResults: Person[] = results.values ? results.values : [];

      return personResults;
    } catch (error) {
      return error;
    }
  }
}
