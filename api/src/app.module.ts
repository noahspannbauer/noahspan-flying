import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AppConfigModule,
  AuthModule,
  AuthGuard,
  MsGraphModule
} from '@noahspan/noahspan-modules';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PilotModule } from './pilot/pilot.module';
import { PilotController } from './pilot/pilot.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule.register({
      url: process.env.APP_CONFIG_URL,
      tenantId: process.env.TENANT_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    }),
    AuthModule.register({
      tenantId: process.env.TENANT_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    }),
    MsGraphModule.register({
      tenantId: process.env.TENANT_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    }),
    PilotModule
  ],
  controllers: [AppController, PilotController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    AppService
  ]
})
export class AppModule {}
