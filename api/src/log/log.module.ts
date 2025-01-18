import { Module } from '@nestjs/common';
import { DaprModule, DaprService } from '@noahspan/noahspan-modules';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { AzureTableStorageModule } from '@noahspan/azure-database';
import { Log } from './log.entity';

@Module({
  imports: [
    AzureTableStorageModule.forRootAsync({
      imports: [DaprModule],
      useFactory: async (daprService: DaprService) => {
        const connectionString = await daprService.daprClient.secret.get(
          'key-vault',
          'azure-storage-connection-string'
        );

        return {
          connectionString:
            connectionString['azure-storage-connection-string'].toString()
        };
      },
      inject: [DaprService]
    }),
    AzureTableStorageModule.forFeature(Log, {
      createTableIfNotExists: false,
      table: 'logs'
    }),
    DaprModule
  ],
  controllers: [LogController],
  providers: [LogService]
})
export class LogModule {}
