import { Injectable } from '@nestjs/common';
import { InjectRepository, Repository } from '@noahspan/azure-database';
import { Log } from './log.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
  ) {}

  async find(partitionKey: string, rowKey: string): Promise<Log> {
    return await this.logRepository.find(partitionKey, rowKey);
  }

  async findAll(): Promise<Log[]> {
    return await this.logRepository.findAll();
  }

  async create(log: Log): Promise<Log> {
    log.partitionKey = 'log';
    log.rowKey = uuidv4();

    return await this.logRepository.create(log);
  }

  async update(partitionKey: string, rowKey: string, log: Log): Promise<Log> {
    return await this.logRepository.update(partitionKey, rowKey, log);
  }

  async delete(partitionKey: string, rowKey: string): Promise<void> {
    await this.logRepository.delete(partitionKey, rowKey);
  }
}
