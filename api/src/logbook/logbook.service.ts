import { Injectable } from '@nestjs/common';
import { TableClient, TableService } from '@noahspan/noahspan-modules';
import { LogbookDto } from './logbook.dto';
import { LogbookEntity } from './logbook.entity';
import { odata, RestError, TableInsertEntityHeaders } from '@azure/data-tables';
import { CustomError } from '../customError/CustomError';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogbookService {
  constructor(private readonly tableService: TableService) {}

  async findAll(): Promise<LogbookEntity[]> {
    try {
      const client: TableClient =
        await this.tableService.getTableClient('Logbook');
      const entities = await client.listEntities({
        queryOptions: { filter: odata`PartitionKey eq 'entry'` }
      });
      const logbookEntries: LogbookEntity[] = [];

      for await (const entity of entities) {
        const logbookEntry = {
          partitionKey: entity.partitionKey.toString(),
          rowKey: entity.rowKey.toString(),
          id: entity.rowKey.toString(),
          pilotId: entity.pilotId.toString(),
          pilotName: entity.pilotName.toString(),
          date: entity.date.toString(),
          aircraftMakeModel: entity.aircraftMakeModel.toString(),
          aircraftIdentity: entity.aircraftIdentity.toString(),
          routeFrom: entity.routeFrom.toString(),
          routeTo: entity.routeTo.toString(),
          durationOfFlight: Number(entity.durationOfFlight),
          singleEngineLand: entity.singleEngineLand
            ? Number(entity.singleEngineLand)
            : null,
          simulatorAtd: entity.simulatorAtd
            ? Number(entity.simulatorAtd)
            : null,
          landingsDay: entity.landingsDay ? Number(entity.landingsDay) : null,
          landingsNight: entity.landingsNight
            ? Number(entity.landingsNight)
            : null,
          groundTrainingReceived: entity.groundTrainingReceived
            ? Number(entity.groundTrainingReceived)
            : null,
          flightTrainingReceived: entity.flightTrainingReceived
            ? Number(entity.flightTrainingReceived)
            : null,
          crossCountry: entity.crossCountry
            ? Number(entity.crossCountry)
            : null,
          night: entity.night ? Number(entity.night) : null,
          solo: entity.solo ? Number(entity.solo) : null,
          pilotInCommand: entity.pilotInCommand
            ? Number(entity.pilotInCommand)
            : null,
          instrumentActual: entity.instrumentActual
            ? Number(entity.instrumentActual)
            : null,
          instrumentSimulated: entity.instrumentSimulated
            ? Number(entity.instrumentSimulated)
            : null,
          instrumentApproaches: entity.instrumentApproaches
            ? Number(entity.instrumentApproaches)
            : null,
          instrumentHolds: entity.instrumentHolds
            ? Number(entity.instrumentHolds)
            : null,
          instrumentNavTrack: entity.instrumentNavTrack
            ? Number(entity.instrumentNavTrack)
            : null,
          notes: entity.notes.toString()
        };
        console.log(logbookEntry);
        logbookEntries.push(logbookEntry);
      }

      return logbookEntries;
    } catch (error) {
      const restError: RestError = error as RestError;

      throw new CustomError(
        restError.details['odataError']['message']['value'],
        restError.details['odataError']['code'],
        restError.statusCode
      );
    }
  }

  async create(logbookData: LogbookDto): Promise<TableInsertEntityHeaders> {
    const client: TableClient =
      await this.tableService.getTableClient('Logbook');
    const logbook: LogbookEntity = new LogbookEntity();

    Object.assign(logbook, logbookData);
    logbook.partitionKey = 'entry';
    logbook.rowKey = `${logbook.pilotId}:${uuidv4()}`;

    try {
      return await client.createEntity(logbook);
    } catch (error) {
      const restError: RestError = error as RestError;

      throw new CustomError(
        restError.details['odataError']['message']['value'],
        restError.details['odataError']['code'],
        restError.statusCode
      );
    }
  }
}
