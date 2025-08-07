import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { LogDto } from './log.dto';
import { PilotService } from 'src/pilot/pilot.service';
import { PilotEntity } from 'src/pilot/pilot.entity';
import { CustomError } from 'src/error/customError';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity) private readonly logRepository: Repository<LogEntity>,
    private readonly pilotService: PilotService
  ) {}

  async find(id: string): Promise<LogEntity> {
    const logEntity: LogEntity = await this.logRepository.findOne({
      where: { id: id },
      relations: ['pilot', 'tracks']
    });
    console.log(logEntity);
    return logEntity;
  }

  async findAll(): Promise<LogEntity[]> {
    return await this.logRepository.find();
  }

  async create(logDto: LogDto): Promise<InsertResult> {
    try{
      const pilotEntity: PilotEntity = await this.pilotService.find(logDto.pilotId);

      if (pilotEntity) {
        const { pilotId, ...newLogDto } = logDto;
        const log = this.logRepository.create({
          ...newLogDto,
          pilot: pilotEntity
        })

        return this.logRepository.insert(log);
      } else {
        throw new CustomError('Pilot not found', 'Not found', 404);
      }
    } catch (error) {
      throw error
    }
  }

  async update(id: string, log: LogDto): Promise<UpdateResult> {
    return await this.logRepository.update(id, log);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.logRepository.delete({ id });
  }
}
