import { Injectable } from '@nestjs/common';
// import { Repository, InjectRepository } from '@nestjs/azure-database';
import { PilotInfoDto } from './pilot-info.dto';
import { PilotInfoEntity } from './pilot-info.entity';
import { TableClient, TableService } from '@noahspan/noahspan-modules';

@Injectable()
export class PilotInfoService {
  private readonly partitionKey: string = 'info';

  constructor(
    // @InjectRepository(PilotInfo)
    // private readonly pilotInfoRepository: Repository<PilotInfo>
    private readonly tableService: TableService
  ) {}

  // async find(rowKey: string): Promise<PilotInfo> {
  //   return await this.pilotInfoRepository.find(this.partitionKey, rowKey);
  // }

  // async findAll(): Promise<PilotInfo[]> {
  //   return await this.pilotInfoRepository.findAll();
  // }

  async create(pilotInfoData: PilotInfoDto): Promise<void> {
    const client: TableClient =
      await this.tableService.getTableClient('Pilots');
    const pilotInfo: PilotInfoEntity = new PilotInfoEntity();

    Object.assign(pilotInfo, pilotInfoData);
    pilotInfo.partitionKey = 'pilot';
    pilotInfo.rowKey = pilotInfo.id;
    console.log(pilotInfo);
    try {
      await client.createEntity(pilotInfo);
    } catch (error) {
      return error;
    }
  }

  // async update(rowKey: string, pilotInfo: PilotInfo): Promise<PilotInfo> {
  //   return await this.pilotInfoRepository.update(
  //     this.partitionKey,
  //     rowKey,
  //     pilotInfo
  //   );
  // }

  // async delete(rowKey: string): Promise<void> {
  //   await this.pilotInfoRepository.delete(this.partitionKey, rowKey);
  // }
}
