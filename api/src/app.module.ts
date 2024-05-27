import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzAppConfigModule } from '@noahspan/noahspan-modules';

@Module({
  imports: [
    AzAppConfigModule.register({
      connectionString: process.env.AZ_APP_CONFIG_CONNECTION_STRING
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
