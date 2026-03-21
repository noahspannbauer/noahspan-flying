import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogDto } from './log.dto';
import { LogEntity } from './log.entity';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

describe('LogController', () => {
  let controller: LogController;

  const mockLogService = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findLogsWithCount: jest.fn(),
    findLogsWithTracks: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        ConfigService,
        FileService,
        {
          provide: LogService,
          useValue: mockLogService
        }
      ]
    }).compile()

    controller = module.get<LogController>(LogController);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('find => should find a log by id', async () => {
    const log = {
      id: '95834f84-0a02-44d3-884e-a20237adeca0',
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test',
      tracks: []
    } as LogEntity

    jest.spyOn(mockLogService, 'find').mockReturnValue(log);

    const result = await controller.find(log.id);

    expect(result).toEqual(log);
    expect(mockLogService.find).toHaveBeenCalled();
    expect(mockLogService.find).toHaveBeenCalledWith(log.id);
  })

  it('find => should fail to find a log by id', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';

    jest.spyOn(mockLogService, 'find').mockRejectedValue(new Error('Log not found'))

    try {
      await controller.find(id);

      fail('find did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.find).toHaveBeenCalled();
      expect(mockLogService.find).toHaveBeenCalledWith(id);
      expect(mockLogService.find).rejects.toThrow('Log not found')
    }
  })

  it('findLogsWithCount => should find logs with count', async () => {
    const log = {
      id: '95834f84-0a02-44d3-884e-a20237adeca0',
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test',
      tracks: [
        {
          "id": "4645ce0c-6fd7-432c-8089-777a7139cf7e",
          "url": "http://127.0.0.1:10000/devstoreaccount1/tracks/0e7a641a-0264-47f0-88bf-7c296c842d8b/FlightAware_N70392_KANE_KONA_20250628.kml",
          "order": 1
        },
        {
          "id": "5ce26898-a18b-46f4-b989-3fb7acdace08",
          "url": "http://127.0.0.1:10000/devstoreaccount1/tracks/0e7a641a-0264-47f0-88bf-7c296c842d8b/FlightAware_N70392_KONA_KANE_20250628.kml",
          "order": 2
        }
      ]
    } as LogEntity;
    const logs = [log]
    const count = 1
    const morePages = false

    jest.spyOn(mockLogService, 'findLogsWithCount').mockReturnValue({
      entities: logs, 
      total: count, 
      hasNextPage: morePages
    });

    const {entities, total, hasNextPage} = await controller.findLogsWithCount();

    expect(entities).toEqual(logs);
    expect(total).toEqual(count);
    expect(hasNextPage).toEqual(morePages)
    expect(mockLogService.findLogsWithCount).toHaveBeenCalled();
  })

  it('findLogsWithCount => should fail to find logs with count', async () => {
    jest.spyOn(mockLogService, 'findLogsWithCount').mockRejectedValue(new Error('Logs not found'))

    try {
      await controller.findLogsWithCount();

      fail('findLogsWithCount did not throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.findLogsWithCount).toHaveBeenCalled();
      expect(mockLogService.findLogsWithCount).rejects.toThrow('Logs not found')
    }
  })

  it('findLogsWithTracks => should find logs with tracks', async () => {
    const log = {
      id: '95834f84-0a02-44d3-884e-a20237adeca0',
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test',
      tracks: [
        {
            "id": "4645ce0c-6fd7-432c-8089-777a7139cf7e",
            "url": "http://127.0.0.1:10000/devstoreaccount1/tracks/0e7a641a-0264-47f0-88bf-7c296c842d8b/FlightAware_N70392_KANE_KONA_20250628.kml",
            "order": 1
        },
        {
            "id": "5ce26898-a18b-46f4-b989-3fb7acdace08",
            "url": "http://127.0.0.1:10000/devstoreaccount1/tracks/0e7a641a-0264-47f0-88bf-7c296c842d8b/FlightAware_N70392_KONA_KANE_20250628.kml",
            "order": 2
        }
      ]
    } as LogEntity;
    const logs = [log]
    const count = 1
    const morePages = false

    jest.spyOn(mockLogService, 'findLogsWithTracks').mockReturnValue({
      entities: logs, 
      total: count, 
      hasNextPage: morePages
  });

    const {entities, total, hasNextPage} = await controller.findLogsWithTracks();

    expect(entities).toEqual(logs);
    expect(total).toEqual(count);
    expect(hasNextPage).toEqual(morePages)
    expect(mockLogService.findLogsWithTracks).toHaveBeenCalled();
  })

  it('findLogsWithCount => should fail to find logs with tracks', async () => {
    jest.spyOn(mockLogService, 'findLogsWithTracks').mockRejectedValue(new Error('Logs not found'))

    try {
      await controller.findLogsWithTracks();

      fail('findLogsWithTracks did not throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.findLogsWithTracks).toHaveBeenCalled();
      expect(mockLogService.findLogsWithTracks).rejects.toThrow('Logs not found')
    }
  })

  it('create => should create a new log', async () => {
    const logDto = {
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test'
    } as LogDto;

    const log = {
      id: '95834f84-0a02-44d3-884e-a20237adeca0',
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test',
      tracks: []
    } as LogEntity;

    jest.spyOn(mockLogService, 'create').mockReturnValue(log);

    const result = await controller.create(logDto);

    expect(mockLogService.create).toHaveBeenCalled();
    expect(mockLogService.create).toHaveBeenCalledWith(logDto);
    expect(result).toEqual(log);
  })

  it('create => should fail to create a new log', async () => {
    const logDto = {
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test'
    } as LogDto;

    jest.spyOn(mockLogService, 'create').mockRejectedValue(new Error('Log failed to create'))

    try {
      await controller.create(logDto);

      fail('create did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.create).toHaveBeenCalled();
      expect(mockLogService.create).toHaveBeenCalledWith(logDto);
      expect(mockLogService.create).rejects.toThrow('Log failed to create')
    }
  })

  it('update => should update an existing log', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const logDto = {
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test'
    } as LogDto

    jest.spyOn(mockLogService, 'update').mockReturnValue(logDto);

    const result = await controller.update(id, logDto);

    expect(result).toEqual(logDto);
    expect(mockLogService.update).toHaveBeenCalled();
    expect(mockLogService.update).toHaveBeenCalledWith(id, logDto);
  })

  it('update => should fail to update an exising log', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const logDto = {
      pilotId: '7c4bae6b-9ec4-469e-8e16-fcbf0b940936',
      date: new Date('2026-02-21'),
      aircraftMakeModel: 'Cessna 172M',
      aircraftIdentity: 'N12345',
      routeFrom: 'KMSP',
      routeTo: 'KMSP',
      durationOfFlight: 1,
      singleEngineLand: 1,
      simulatorAtd: null,
      landingsDay: 1,
      landingsNight: null,
      groundTrainingReceived: null,
      flightTrainingReceived: null,
      crossCountry: 1,
      night: null,
      solo: 1,
      pilotInCommand: 1,
      instrumentActual: null,
      instrumentSimulated: null,
      instrumentApproaches: null,
      instrumentHolds: null,
      instrumentNavTrack: null,
      notes: 'This is a test'
    } as LogDto;

    jest.spyOn(mockLogService, 'update').mockRejectedValue(new Error('Log failed to update'))

    try {
      await controller.update(id, logDto);

      fail('update did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.update).toHaveBeenCalled();
      expect(mockLogService.update).toHaveBeenCalledWith(id, logDto);
      expect(mockLogService.update).rejects.toThrow('Log failed to update')
    }
  })

  it('delete => should delete and existing log', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';

    jest.spyOn(mockLogService, 'delete');

    const result = await controller.delete(id);

    expect(mockLogService.delete).toHaveBeenCalled();
    expect(mockLogService.delete).toHaveBeenCalledWith(id);
  })

  it('delete => should fail to delete and exising log', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';

    jest.spyOn(mockLogService, 'delete').mockRejectedValue(new Error('Log failed to delete'));

    try {
      await controller.delete(id);

      fail('delete did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.delete).toHaveBeenCalled();
      expect(mockLogService.delete).toHaveBeenCalledWith(id);
      expect(mockLogService.delete).rejects.toThrow('Log failed to delete')
    }
  })
})