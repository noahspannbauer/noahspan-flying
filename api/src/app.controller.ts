import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UnprocessableEntityException
} from '@nestjs/common';
import {
  AppConfigService,
  MsGraphService,
  MsGraphClient
} from '@noahspan/noahspan-modules';
import { FeatureFlagValue } from '@azure/app-configuration';
import { Public } from '@noahspan/noahspan-modules';
import { Person } from '@microsoft/microsoft-graph-types';
import { AppService } from './app.service';
import { PilotDTO } from './pilot/pilot.dto';
import { PilotService } from './pilot/pilot.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appConfigService: AppConfigService,
    private readonly msGraphService: MsGraphService
  ) {}

  @Public()
  @Get('featureFlags')
  async getFeatureFlags(
    @Query() query: any
  ): Promise<{ key: string; enabled: boolean }[]> {
    try {
      console.log(query);
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
        headers.authorization.replace('Bearer ', ''),
        ['user.read']
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
      const accessToken: string = headers.authorization.replace('Bearer ', '');
      const personSearchResults: Person[] =
        await this.appService.getPersonSearchResults(accessToken, search);
      console.log(personSearchResults);
      return personSearchResults;
    } catch (error) {
      return error;
    }
  }
}
