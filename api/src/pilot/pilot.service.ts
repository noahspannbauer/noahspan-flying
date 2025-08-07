import { Injectable } from '@nestjs/common';
import { PilotEntity } from './pilot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { PilotDto } from './pilot.dto';
import { CustomError } from 'src/error/customError';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(PilotEntity) private readonly pilotRepository: Repository<PilotEntity>
  ) {}

  async find(id: string): Promise<PilotEntity> {
    try {
      const pilotEntity = await this.pilotRepository.findOneBy({ id });

      if (pilotEntity) {
        return pilotEntity
      } else {
        throw new CustomError('Pilot not found', 'Not found', 404)
      }
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<PilotEntity[]> {
    return await this.pilotRepository.find();
  }

  async create(pilot: PilotDto): Promise<InsertResult> {
    return await this.pilotRepository.insert(pilot);
  }

  async update(
    id: string,
    pilot: PilotDto
  ): Promise<UpdateResult> {
    return await this.pilotRepository.update(id, pilot);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.pilotRepository.delete({ id });
  }
}
