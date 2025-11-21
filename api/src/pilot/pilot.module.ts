import { Module } from '@nestjs/common';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';
import { PilotEntity } from './pilot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PilotEntity])
  ],
  controllers: [PilotController],
  exports: [PilotService],
  providers: [PilotService]
})
export class PilotModule {}
