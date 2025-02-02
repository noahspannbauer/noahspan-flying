import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '@noahspan/azure-database';
import { FeatureFlag } from './feature-flag.entity';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlag) private readonly featureFlagRepository: Repository<FeatureFlag>
  ) {}

  async find(partitionKey: string, rowKey: string): Promise<FeatureFlag> {
    return await this.featureFlagRepository.find(partitionKey, rowKey);
  }

  async findAll(): Promise<FeatureFlag[]> {
    return await this.featureFlagRepository.findAll();
  }
}
