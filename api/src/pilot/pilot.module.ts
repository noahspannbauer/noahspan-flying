import { Module } from '@nestjs/common';
import { DaprModule, DaprService } from '@noahspan/noahspan-modules';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';
import { AzureTableStorageModule } from '@noahspan/azure-database';
import { Pilot } from './pilot.entity';

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
    AzureTableStorageModule.forFeature(Pilot, {
      createTableIfNotExists: false,
      table: 'pilots'
    }),
    DaprModule
  ],
  controllers: [PilotController],
  providers: [PilotService]
})
export class PilotModule {}
