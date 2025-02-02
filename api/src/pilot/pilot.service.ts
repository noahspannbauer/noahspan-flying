import { InjectRepository, Repository } from '@noahspan/azure-database';
import { Injectable } from '@nestjs/common';
import { Pilot } from './pilot.entity';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(Pilot)
    private readonly pilotRepository: Repository<Pilot>
  ) {}

  async find(partitionKey: string, rowKey: string): Promise<Pilot> {
    return await this.pilotRepository.find(partitionKey, rowKey);
  }

  async findAll(): Promise<Pilot[]> {
    return await this.pilotRepository.findAll();
  }

  async create(pilot: Pilot): Promise<Pilot> {
    // try {
    //   return await this.pilotRepository.create(pilot);
    // } catch (error) {
    //   throw new Error(error);
    // }
    return await this.pilotRepository.create(pilot);
  }

  async update(
    partitionKey: string,
    rowKey: string,
    pilot: Pilot
  ): Promise<Pilot> {
    return await this.pilotRepository.update(partitionKey, rowKey, pilot);
  }

  async delete(partitionKey: string, rowKey: string): Promise<void> {
    await this.pilotRepository.delete(partitionKey, rowKey);
  }
}
