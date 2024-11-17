import { Module } from '@nestjs/common';
import { LogbookController } from './logbook.controller';
import { LogbookService } from './logbook.service';
import { TableModule } from '@noahspan/noahspan-modules';

@Module({
  imports: [
    TableModule.register({
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
      accountUrl: process.env.AZURE_STORAGE_ACCOUNT_URL,
      allowInsecureConnection: Boolean(
        process.env.AZURE_STORAGE_ALLOW_INSECURE_CONNECTION
      )
    })
  ],
  controllers: [LogbookController],
  providers: [LogbookService]
})
export class LogbookModule {}
