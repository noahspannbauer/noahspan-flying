import { Module } from '@nestjs/common';
import { PilotController } from './pilot.controller';
import { TableModule } from '@noahspan/noahspan-modules';
import { PilotInfoService } from './info/pilot-info.service';

@Module({
  imports: [
    TableModule.register({
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY
    })
  ],
  controllers: [PilotController],
  providers: [PilotInfoService]
})
export class PilotModule {}
