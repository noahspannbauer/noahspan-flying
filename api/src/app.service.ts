import { Injectable } from '@nestjs/common';
import { MsGraphService, MsGraphClient } from '@noahspan/noahspan-modules';
import { Person } from '@microsoft/microsoft-graph-types';

@Injectable()
export class AppService {
  constructor(private readonly msGraphService: MsGraphService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPersonSearchResults(
    accessToken: string,
    search: string
  ): Promise<Person[]> {
    try {
      const graphToken: string = await this.msGraphService.getMsGraphAuth(
        accessToken,
        ['user.read']
      );
      const client: MsGraphClient =
        await this.msGraphService.getMsGraphClientDelegated(graphToken);
      const results: any = await client
        .api(`me/people/?$search=${search}`)
        .get();
      let personResults: Person[];

      if (results.value) {
        personResults = results.value.filter((result: Person) => {
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
