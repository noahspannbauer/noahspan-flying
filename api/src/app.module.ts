import { Module } from '@nestjs/common';
import { FeatureFlagModule } from './featureFlag/feature-flag.module'
import { LogModule } from './log/log.module';
import { PilotModule } from './pilot/pilot.module';
import { APP_FILTER, APP_GUARD, Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, AuthModule, UserModule } from '@noahspan/noahspan-modules';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          clientId: configService.get<string>('clientId'),
          clientSecret: configService.get<string>('clientSecret'),
          tenantId: configService.get<string>('tenantId')
        };
      },
    }),
    ConfigModule.forRoot({
      load: [configuration]
    }),
    FeatureFlagModule,
    LogModule,
    PilotModule,
    UserModule.registerAsync({
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
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // },
    // Reflector
  ]
})
export class AppModule {}
