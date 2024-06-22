import { Injectable } from '@nestjs/common';
import { Repository, InjectRepository } from '@nestjs/azure-database';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  private readonly partitionKey: string = 'profile';

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) {}

  async find(rowKey: string): Promise<Profile> {
    return await this.profileRepository.find(this.partitionKey, rowKey);
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.findAll();
  }

  async create(profile: Profile): Promise<Profile> {
    return await this.profileRepository.create(profile);
  }

  async update(rowKey: string, profile: Profile): Promise<Profile> {
    return await this.profileRepository.update(
      this.partitionKey,
      rowKey,
      profile
    );
  }

  async delete(rowKey: string): Promise<void> {
    await this.profileRepository.delete(this.partitionKey, rowKey);
  }
}
