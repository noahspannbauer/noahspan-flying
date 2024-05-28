import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule, AuthModule } from '@noahspan/noahspan-modules';

@Module({
  imports: [
    AppConfigModule.register({
      url: process.env.APP_CONFIG_URL
    }),
    AuthModule.register({
      tenantId: process.env.TENANT_ID
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
