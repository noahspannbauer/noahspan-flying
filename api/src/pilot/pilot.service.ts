import { InjectRepository, Repository } from '@noahspan/azure-database';
import { Inject, Injectable } from '@nestjs/common';
import { Pilot } from './pilot.entity';
import { Log } from 'src/log/log.entity';
import { LogService } from 'src/log/log.service';

@Injectable()
export class PilotService {
  constructor(
    @InjectRepository(Pilot) private readonly pilotRepository: Repository<Pilot>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>
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
    const pilotLogs: Log[] = await this.logRepository.findAll({
      queryOptions: {
        filter: `pilotId eq '${rowKey}'`
      }
    })

    for (const pilotLog of pilotLogs) {
      await this.logRepository.delete(pilotLog.partitionKey, pilotLog.rowKey);
    }

    await this.pilotRepository.delete(partitionKey, rowKey);

    return
  }
}
