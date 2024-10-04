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

  async find(pilotId: string): Promise<PilotInfoEntity> {
    try {
      const client: TableClient =
        await this.tableService.getTableClient('Pilots');
      const entities = await client.listEntities({
        queryOptions: {
          filter: odata`PartitionKey eq 'pilot' and RowKey eq '${pilotId}'`
        }
      });
      let pilot: PilotInfoEntity;
      console.log(entities);
      for await (const entity of entities) {
        pilot = {
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          id: entity.id.toString(),
          name: entity.name.toString(),
          address: entity.address.toString(),
          city: entity.city.toString(),
          state: entity.state.toString(),
          postalCode: entity.postalCode.toString(),
          email: entity.email.toString(),
          phone: entity.phone.toString()
        };
      }

      return pilot;
    } catch (error) {
      const restError: RestError = error as RestError;

      throw new CustomError(
        restError.details['odataError']['message']['value'],
        restError.details['odataError']['code'],
        restError.statusCode
      );
    }
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
