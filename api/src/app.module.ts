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
import { LogbookModule } from './logbook/logbook.module';
import { PilotModule } from './pilot/pilot.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

console.log('app: ' + process.env);

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
    LogbookModule,
    PilotModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    AppService
  ]
})
export class AppModule {}
