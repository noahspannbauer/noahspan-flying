import { Module } from '@nestjs/common';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Pilot } from './pilot.entity';

@Module({
  imports: [
    AzureTableStorageModule.forFeature(Pilot, {
      table: 'Pilot',
      createTableIfNotExists: true
    })
  ],
  controllers: [PilotController],
  providers: [PilotService]
})
export class PilotModule {}
