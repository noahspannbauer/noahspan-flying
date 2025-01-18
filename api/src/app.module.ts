import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, AuthModule } from '@noahspan/noahspan-modules';
import { MsGraphModule } from '@noahspan/noahspan-modules';
import { APP_GUARD } from '@nestjs/core';
import { LogModule } from './log/log.module';
import { PilotModule } from './pilot/pilot.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DaprModule, DaprService } from '@noahspan/noahspan-modules';
import { AzureTableStorageModule } from '@noahspan/azure-database';

const secretStoreName = 'key-vault';

@Module({
  imports: [
    AuthModule.registerAsync({
      imports: [DaprModule],
      useFactory: async (daprService: DaprService) => {
        const clientIdSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'client-id'
        );
        const clientSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'client-secret'
        );
        const tenantIdSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'tenant-id'
        );

        return {
          clientId: clientIdSecret['client-id'].toString(),
          clientSecret: clientSecret['client-secret'].toString(),
          tenantId: tenantIdSecret['tenant-id'].toString()
        };
      },
      inject: [DaprService]
    }),
    AzureTableStorageModule.forRootAsync({
      imports: [DaprModule],
      useFactory: async (daprService: DaprService) => {
        const connectionString = await daprService.daprClient.secret.get(
          secretStoreName,
          'azure-storage-connection-string'
        );

        return {
          connectionString:
            connectionString['azure-storage-connection-string'].toString()
        };
      },
      inject: [DaprService]
    }),
    DaprModule,
    LogModule,
    MsGraphModule.registerAsync({
      imports: [DaprModule],
      useFactory: async (daprService: DaprService) => {
        const clientIdSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'client-id'
        );
        const clientSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'client-secret'
        );
        const tenantIdSecret = await daprService.daprClient.secret.get(
          secretStoreName,
          'tenant-id'
        );

        return {
          clientId: clientIdSecret['client-id'].toString(),
          clientSecret: clientSecret['client-secret'].toString(),
          tenantId: tenantIdSecret['tenant-id'].toString()
        };
      },
      inject: [DaprService]
    }),
    PilotModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    AppService
  ]
})
export class AppModule {}
