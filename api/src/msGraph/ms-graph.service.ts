import { Inject, Injectable } from '@nestjs/common';
import { MsGraphModuleOptions } from './ms-graph.interface';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationResult, ConfidentialClientApplication, OnBehalfOfRequest } from '@azure/msal-node';
import { MODULE_OPTIONS_TOKEN } from './ms-graph.module-definition';

@Injectable()
export class MsGraphService {
    constructor(@Inject(MODULE_OPTIONS_TOKEN) private msGraphModuleOptions: MsGraphModuleOptions) {}

    async getMsGraphAuth(accessToken: string, scopes: string[]): Promise<string> {
        try {
            const oboRequest: OnBehalfOfRequest = {
                oboAssertion: accessToken,
                scopes: scopes
            }
            const cca = new ConfidentialClientApplication({
                auth: {
                    clientId: this.msGraphModuleOptions.clientId,
                    clientSecret: this.msGraphModuleOptions.clientSecret,
                    authority: `https://login.microsoftonline.com/${this.msGraphModuleOptions.tenantId}`
                }
            });
            const authenticationResult: AuthenticationResult = await cca.acquireTokenOnBehalfOf(oboRequest);

            return authenticationResult.accessToken
        } catch (error) {
            return error
        }  
    }

    async getMsGraphClientDelegated(accessToken): Promise<Client> {
        const client = await Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });

        return client;
    }
}