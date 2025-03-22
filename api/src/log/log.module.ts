import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { AzureTableStorageModule } from '@noahspan/azure-database';
import { Log } from './log.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from '../file/file.service';

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
  ],
  controllers: [LogController],
  providers: [
    ConfigService,
    FileService,
    LogService
  ]
})
export class LogModule {}
