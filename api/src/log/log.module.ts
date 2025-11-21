import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogEntity } from './log.entity';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file/file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotModule } from 'src/pilot/pilot.module';

@Module({
  imports: [
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
