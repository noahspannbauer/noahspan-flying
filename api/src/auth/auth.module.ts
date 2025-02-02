import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './auth.strategy';
import { ConfigurableModuleClass } from './auth.module-definition';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'azure-ad'
    })
  ],
  providers: [AzureAdStrategy]
})
export class AuthModule extends ConfigurableModuleClass {}
