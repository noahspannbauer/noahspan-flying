import { Injectable } from '@nestjs/common';
import { MsGraphService, MsGraphClient } from '@noahspan/noahspan-modules';
import { Person } from '@microsoft/microsoft-graph-types';

@Injectable()
export class AppService {
  constructor(private readonly msGraphService: MsGraphService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPersonSearchResults(accessToken: string): Person[] {
    const graphToken: string = await this.msGraphService.getMsGraphAuth(
      accessToken,
      ['user.read']
    );
    console.log(graphToken);
    const client: MsGraphClient =
      await this.msGraphService.getMsGraphClientDelegated(graphToken);
    const results: any = await client.api(`me/people/?$search=${search}`).get();
    console.log(results);
    const personResults: Person[] = results.values ? results.values : [];

    return personResults;
  }
}
