import {
  Controller,
  Get,
  Headers,
  Query,
  StreamableFile,
  UseGuards
} from '@nestjs/common';
import { Client as MsGraphClient } from '@microsoft/microsoft-graph-client';
import { MsGraphService } from './msGraph/ms-graph.service'
import { Person } from '@microsoft/microsoft-graph-types';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard('azure-ad'))
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly msGraphService: MsGraphService
  ) {}

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

  @Get('hello')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
