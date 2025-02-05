import { Module } from '@nestjs/common';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';
import { AzureTableStorageModule } from '@noahspan/azure-database';
import { Pilot } from './pilot.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Log } from 'src/log/log.entity';

@Module({
  imports: [
    AzureTableStorageModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionString: configService.get<string>('azureStorageConnectionString')
        };
      },
      inject: [ConfigService]
    }),
    AzureTableStorageModule.forFeature(Log, {
      createTableIfNotExists: false,
      table: 'logs'
    }),
    AzureTableStorageModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionString: configService.get<string>('azureStorageConnectionString')
        };
      },
      inject: [ConfigService]
    }),
    AzureTableStorageModule.forFeature(Pilot, {
      createTableIfNotExists: false,
      table: 'pilots'
    })
  ],
  controllers: [PilotController],
  providers: [PilotService]
})
export class PilotModule {}
