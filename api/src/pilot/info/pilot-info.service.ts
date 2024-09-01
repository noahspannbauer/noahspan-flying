import { HttpException, Injectable } from '@nestjs/common';
// import { Repository, InjectRepository } from '@nestjs/azure-database';
import { PilotInfoDto } from './pilot-info.dto';
import { PilotInfoEntity } from './pilot-info.entity';
import { TableClient, TableService } from '@noahspan/noahspan-modules';
import { RestError, TableInsertEntityHeaders } from '@azure/data-tables';
import { CustomError } from '../../customError/CustomError';

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

  async create(pilotInfoData: PilotInfoDto): Promise<TableInsertEntityHeaders> {
    const client: TableClient =
      await this.tableService.getTableClient('Pilots');
    const pilotInfo: PilotInfoEntity = new PilotInfoEntity();

    Object.assign(pilotInfo, pilotInfoData);
    pilotInfo.partitionKey = 'pilot';
    pilotInfo.rowKey = pilotInfo.id;

    try {
      return await client.createEntity(pilotInfo);
    } catch (error) {
      const restError: RestError = error as RestError;

      throw new CustomError(
        restError.details['odataError']['message']['value'],
        restError.details['odataError']['code'],
        restError.statusCode
      );
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
