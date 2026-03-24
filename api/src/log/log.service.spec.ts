import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';
import { LogDto } from './log.dto';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { PilotService } from '../pilot/pilot.service';
import { PilotEntity } from '../pilot/pilot.entity';

describe('LogService', () => {
  let service: LogService;

  const mockFileService = {
    deleteFolder: jest.fn()
  }

  const mockQueryBuilder = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn()
  }

  const mockLogRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    delete: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  }

  const mockPilotRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        LogService,
        PilotService,
        {
          provide: FileService,
          useValue: mockFileService
        },
        {
          provide: getRepositoryToken(LogEntity),
          useValue: mockLogRepository
        },
        {
          provide: getRepositoryToken(PilotEntity),
          useValue: mockPilotRepository
        }
      ]
    }).compile();

    service = module.get<LogService>(LogService);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('create => should create a log entry', async () => {
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

    jest.spyOn(mockLogRepository, 'save').mockReturnValue(logDto);

    const result = await service.create(logDto);

    expect(mockLogRepository.save).toHaveBeenCalled();
    expect(mockLogRepository.save).toHaveBeenCalledWith(logDto);
  })

  it('delete => should delete a log entry', async () => {
    const id: string = '';
    const log = {
      id: 'd685f1ca-28e0-40b9-8713-74467db12965',
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

    jest.spyOn(mockFileService, 'deleteFolder').mockReturnValue(undefined);
    jest.spyOn(mockLogRepository, 'delete').mockReturnValue(log);

    const result = await service.delete(id);

    expect(result).toEqual(log);
    expect(mockLogRepository.delete).toHaveBeenCalled();
    expect(mockLogRepository.delete).toHaveBeenCalledWith({ id: id })
  })

  it('find => should find a log entry by id', async () => {
    const id: string = 'd685f1ca-28e0-40b9-8713-74467db12965';
    const log = {
      id: 'd685f1ca-28e0-40b9-8713-74467db12965',
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

    jest.spyOn(mockLogRepository, 'findOne').mockReturnValue(log);

    const result = await service.find(id);

    expect(result).toEqual(log);
    expect(mockLogRepository.findOne).toHaveBeenCalled();
    expect(mockLogRepository.findOne).toHaveBeenCalledWith({
      relations: [
        'pilot',
        'tracks'
      ],
      where: {
        id: id
      }
    })
  })

  it('findLogsWithCount => should find log entries with count', async () => {
    const log = {
      id: 'd685f1ca-28e0-40b9-8713-74467db12965',
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
    const logs = [log];
    const count = 1
    const morePages = false
    
    jest.spyOn(mockQueryBuilder, 'getManyAndCount').mockReturnValue([logs, count, morePages]);

    const {entities, total, hasNextPage} = await service.findLogsWithCount();

    expect(entities).toEqual(logs);
    expect(count).toEqual(total);
    expect(hasNextPage).toEqual(morePages);
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  })

    it('findLogsWithTracks => should find log entries with tracks', async () => {
    const log = {
      id: 'd685f1ca-28e0-40b9-8713-74467db12965',
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
    const logs = [log];
    const count = 1
    const morePages = false
    
    jest.spyOn(mockQueryBuilder, 'getManyAndCount').mockResolvedValue([logs, count, morePages])

    const {entities, total, hasNextPage} = await service.findLogsWithTracks();

    expect(entities).toEqual(logs);
    expect(count).toEqual(total);
    expect(hasNextPage).toEqual(morePages);
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  })

  it('update => should update a log entry', async () => {
    const id: string = 'd685f1ca-28e0-40b9-8713-74467db12965';
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
    const log = {
      id: 'd685f1ca-28e0-40b9-8713-74467db12965',
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

    jest.spyOn(mockLogRepository, 'findOneBy').mockReturnValue(log);
    jest.spyOn(mockLogRepository, 'save').mockReturnValue(logDto);
    
    const result = await service.update(id, logDto);
    
    expect(result).toEqual(logDto);
    expect(mockLogRepository.findOneBy).toHaveBeenCalled();
    expect(mockLogRepository.findOneBy).toHaveBeenCalledWith({ id: id });
    expect(mockLogRepository.save).toHaveBeenCalled();
    expect(mockLogRepository.save).toHaveBeenCalledWith(logDto);
  })
})