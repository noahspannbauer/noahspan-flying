import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, AuthModule } from '@noahspan/noahspan-modules';
import { MsGraphModule } from '@noahspan/noahspan-modules';
import { APP_GUARD } from '@nestjs/core';
import { FeatureFlagModule } from './featureFlag/feature-flag.module'
import { LogModule } from './log/log.module';
import { PilotModule } from './pilot/pilot.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          clientId: configService.get<string>('clientId'),
          clientSecret: configService.get<string>('clientSecret'),
          tenantId: configService.get<string>('tenantId')
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      load: [configuration]
    }),
    FeatureFlagModule,
    LogModule,
    MsGraphModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          clientId: configService.get<string>('clientId'),
          clientSecret: configService.get<string>('clientSecret'),
          tenantId: configService.get<string>('tenantId')
        };
      },
      inject: [ConfigService]
    }),
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
