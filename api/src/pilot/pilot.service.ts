import { Injectable } from '@nestjs/common';
import { PilotEntity } from './pilot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { PilotDto } from './pilot.dto';
import { CustomError } from '../error/customError';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(PilotEntity) private readonly pilotRepository: Repository<PilotEntity>
  ) {}

  async find(id: string): Promise<PilotEntity> {
    try {
      const pilotEntity: PilotEntity = await this.pilotRepository.findOneBy({ id });

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

  async create(pilot: PilotDto): Promise<PilotDto> {
    return await this.pilotRepository.save(pilot);
  }

  async update(
    id: string,
    pilotDto: PilotDto
  ): Promise<PilotDto> {
    const pilotEntity: PilotEntity = await this.pilotRepository.findOneBy({ id })
    const pilotEntityUpdated = Object.assign(pilotEntity, pilotDto)

    return await this.pilotRepository.save(pilotEntityUpdated);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.pilotRepository.delete({ id });
  }
}
