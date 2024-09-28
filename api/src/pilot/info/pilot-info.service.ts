import { Injectable } from '@nestjs/common';
import { PilotInfoDto } from './pilot-info.dto';
import { PilotInfoEntity } from './pilot-info.entity';
import { TableClient, TableService } from '@noahspan/noahspan-modules';
import { odata, RestError, TableInsertEntityHeaders } from '@azure/data-tables';
import { CustomError } from '../../customError/CustomError';

@Injectable()
export class PilotInfoService {
  private readonly partitionKey: string = 'info';

  constructor(private readonly tableService: TableService) {}

  async find(rowKey: string): Promise<PilotInfoEntity> {
    return await this.pilotInfoRepository.find(this.partitionKey, rowKey);
  }

  async findAll(): Promise<PilotInfoEntity[]> {
    try {
      const client: TableClient =
        await this.tableService.getTableClient('Pilots');
      const entities = await client.listEntities({
        queryOptions: { filter: odata`PartitionKey eq 'pilot'` }
      });
      const pilots: PilotInfoEntity[] = [];

      for await (const entity of entities) {
        const pilot: PilotInfoEntity = {
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          id: entity.id.toString(),
          name: entity.name.toString()
        };

        pilots.push(pilot);
      }

      return pilots;
    } catch (error) {
      const restError: RestError = error as RestError;

      throw new CustomError(
        restError.details['odataError']['message']['value'],
        restError.details['odataError']['code'],
        restError.statusCode
      );
    }
  }

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
