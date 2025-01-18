import { InjectRepository, Repository } from '@noahspan/azure-database';
import { Injectable } from '@nestjs/common';
import { Endorsement } from './endorsement.entity';

@Injectable()
export class EndosementService {
  private readonly partitionKey: string = 'endorsement';

  constructor(
    @InjectRepository(Endorsement)
    private readonly endorsementRepository: Repository<Endorsement>
  ) {}

  async find(rowKey: string): Promise<Endorsement> {
    return await this.endorsementRepository.find(this.partitionKey, rowKey);
  }

  async findAll(): Promise<Endorsement[]> {
    return await this.endorsementRepository.findAll();
  }

  async create(endorsement: Endorsement): Promise<Endorsement> {
    return await this.endorsementRepository.create(endorsement);
  }

  async update(rowKey: string, endorsement: Endorsement): Promise<Endorsement> {
    return await this.endorsementRepository.update(
      this.partitionKey,
      rowKey,
      endorsement
    );
  }

  async delete(rowKey: string): Promise<void> {
    await this.endorsementRepository.delete(this.partitionKey, rowKey);
  }
}
