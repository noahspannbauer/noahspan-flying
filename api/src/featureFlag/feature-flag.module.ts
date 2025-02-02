import { Module } from '@nestjs/common';
import { FeatureFlagController } from './feature-flag.controller';
import { FeatureFlagService } from './feature-flag.service';
import { AzureTableStorageModule } from '@noahspan/azure-database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FeatureFlag } from './feature-flag.entity';

@Module({
  imports: [
    AzureTableStorageModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          connectionString: configService.get<string>('azureStorageConnectionString')
        };
      },
      inject: [ConfigService]
    }),
    AzureTableStorageModule.forFeature(FeatureFlag, {
      createTableIfNotExists: false,
      table: 'featureFlags'
    }),
  ],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService]
})
export class FeatureFlagModule {}
