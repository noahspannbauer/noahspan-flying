import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  StreamableFile
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
import { createReadStream } from 'fs';
import { join } from 'path';
import { arrayBuffer } from 'stream/consumers';
import type { Response } from 'express';

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

  @Get('userPhoto')
  async getProfilePhoto(@Headers() headers: any): Promise<StreamableFile> {
    try {
      const graphToken: string = await this.msGraphService.getMsGraphAuth(
        headers.authorization.replace('Bearer ', ''),
        ['user.read']
      );
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClientDelegated(graphToken);
      const blob: Blob = await client.api(`me/photos('48x48')/$value`).get();
      const arrayBuffer: ArrayBuffer = await blob.arrayBuffer();
      const buffer: Buffer = Buffer.from(arrayBuffer);

      return new StreamableFile(buffer, {
        type: 'application/json',
        disposition: `attachment; filename="user_photo.png"`
      });
    } catch (error) {
      return error;
    }
  }

  @Get('userProfile')
  async getUserProfile(@Headers() headers: any): Promise<any> {
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
  ): Promise<any> {
    try {
      const accessToken: string = headers.authorization.replace('Bearer ', '');
      const personSearchResults: any[] =
        await this.appService.getPersonSearchResults(accessToken, search);

      return personSearchResults;
    } catch (error) {
      return error;
    }
  }

  @Public()
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
