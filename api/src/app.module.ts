import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LogModule } from './log/log.module';
import { PilotModule } from './pilot/pilot.module';
import { APP_FILTER, APP_GUARD, Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule, MsGraphModule } from '@noahspan/noahspan-modules';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { TrackModule } from './track/track.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          audience: configService.get<string>('audience'),
          issuerUrl: configService.get<string>('issuer'),
          jwksUri: configService.get<string>('jwksUri')
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // HealthModule,
    // LogModule,
    PilotModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist')
    }),
    // TrackModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    MsGraphModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          clientId: configService.get<string>('clientId'),
          clientSecret: configService.get<string>('clientSecret'),
          tenantId: configService.get<string>('tenantId')
        }
      }
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
