import { Injectable } from '@nestjs/common';
// import { MsGraphService, MsGraphClient } from '@noahspan/noahspan-modules';
import { Client as MsGraphClient } from '@microsoft/microsoft-graph-client';
import { MsGraphService } from './msGraph/ms-graph.service';

@Injectable()
export class AppService {
  constructor(private readonly msGraphService: MsGraphService) {}

  getHello(): string {
    return JSON.stringify(process.env);
  }

  async getPersonSearchResults(
    accessToken: string,
    search: string
  ): Promise<any[]> {
    try {
      const graphToken: string = await this.msGraphService.getMsGraphAuth(
        accessToken,
        ['user.read']
      );
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClientDelegated(graphToken);
      const results: any = await client
        .api('users')
        .header('ConsistencyLevel', 'eventual')
        .search(`"displayName:${search}"`)
        .orderby('displayName')
        .select(['displayName', 'userPrincipalName'])
        .get();
      let personResults: any[];

      if (results.value) {
        personResults = results.value.filter((result: any) => {
          if (result.userPrincipalName !== null) {
            return result;
          }
        });
      } else {
        personResults = [];
      }

      return personResults;
    } catch (error) {
      throw new Error(error);
    }
  }
}
