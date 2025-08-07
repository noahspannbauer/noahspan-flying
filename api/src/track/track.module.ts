import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrackEntity } from "./track.entity";
import { TrackController } from "./track.controller";
import { FileService } from "../file/file.service";
import { TrackService } from './track.service';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    LogModule,
    TypeOrmModule.forFeature([TrackEntity])
  ],
  controllers: [TrackController],
  providers: [
    FileService,
    TrackService
  ]
})
export class TrackModule {}