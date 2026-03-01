import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { LogDto } from './log.dto';
import { PilotService } from '../pilot/pilot.service';
import { PilotEntity } from '../pilot/pilot.entity';
import { CustomError } from '../error/customError';
import { FileService } from '../file/file.service';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity) private readonly logRepository: Repository<LogEntity>,
    private readonly fileService: FileService,
    private readonly pilotService: PilotService,
  ) {}

  async find(id: string): Promise<LogEntity> {
    const logEntity: LogEntity = await this.logRepository.findOne({
      where: { id: id },
      relations: ['pilot', 'tracks']
    });

    return logEntity;
  }

  async findAll(): Promise<LogEntity[]> {
    return await this.logRepository.find({
      relations: ['pilot', 'tracks']
    });
  }

  async create(logDto: LogDto): Promise<LogDto> {
    return this.logRepository.save(logDto);
  }

  async update(id: string, logDto: LogDto): Promise<LogDto> {
    const logEntity: LogEntity = await this.logRepository.findOneBy({ id });
    const logEntityUpdated = Object.assign(logEntity, logDto)

    delete logEntityUpdated.tracks;

    return await this.logRepository.save(logEntityUpdated);
  }

  async delete(id: string): Promise<DeleteResult> {
    await this.fileService.deleteFolder('tracks', id);

    return await this.logRepository.delete({ id });
  }
}
