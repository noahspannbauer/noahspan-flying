import { Injectable } from '@nestjs/common';
import { Repository, InjectRepository } from '@noahspan/azure-database';
import { Medical } from './medical.entity';

@Injectable()
export class MedicalService {
  private readonly partitionKey: string = 'medical';

  constructor(
    @InjectRepository(Medical)
    private readonly profileRepository: Repository<Medical>
  ) {}

  async find(rowKey: string): Promise<Medical> {
    return this.profileRepository.find(this.partitionKey, rowKey);
  }

  async findAll(): Promise<Medical[]> {
    return this.profileRepository.findAll();
  }

  async create(profile: Medical): Promise<Medical> {
    return this.profileRepository.create(profile);
  }

  async update(rowKey: string, profile: Medical): Promise<Medical> {
    return this.profileRepository.update(this.partitionKey, rowKey, profile);
  }

  async delete(rowKey: string) {
    return this.profileRepository.delete(this.partitionKey, rowKey);
  }
}
