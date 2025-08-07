import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
// import { AzureTableStorageModule } from '@noahspan/azure-database';
import { LogEntity } from './log.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from '../file/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotModule } from 'src/pilot/pilot.module';

@Module({
  imports: [
    // AzureTableStorageModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       connectionString: configService.get<string>('azureStorageConnectionString')
    //     };
    //   },
    //   inject: [ConfigService]
    // }),
    // AzureTableStorageModule.forFeature(Log, {
    //   createTableIfNotExists: false,
    //   table: 'logs'
    // }),
    PilotModule,
    TypeOrmModule.forFeature([LogEntity])
  ],
  controllers: [LogController],
  exports: [LogService],
  providers: [
    ConfigService,
    FileService,
    LogService
  ]
})
export class LogModule {}
