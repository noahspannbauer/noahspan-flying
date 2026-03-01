import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity'
import { TrackDto } from './track.dto';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../log/log.service';
import { LogEntity } from '../log/log.entity';
import { PilotService } from '../pilot/pilot.service';
import { PilotEntity } from '../pilot/pilot.entity';
import { Readable } from 'stream';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CustomError } from '../error/customError';

describe('TrackService', () => {
  let service: TrackService;

  const mockFileService = {
    deleteFile: jest.fn(),
    downloadFile: jest.fn(),
    uploadFile: jest.fn()
  }

  const mockLogService = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }

  const mockPilotRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }

  const mockTrackRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    downloadTrackFile: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    insert: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        LogService,
        PilotService,
        TrackService,
        {
          provide: FileService,
          useValue: mockFileService
        },
        {
          provide: LogService,
          useValue: mockLogService
        },
        {
          provide: getRepositoryToken(PilotEntity),
          useValue: mockPilotRepository
        },
        {
          provide: getRepositoryToken(TrackEntity),
          useValue: mockTrackRepository
        }
      ]
    }).compile()

    service = module.get<TrackService>(TrackService);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('create => should upload a track file', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const log = {
      id: '094ec69c-72c4-4995-8821-79d5b79bedda',
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
    const order = 1;
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test_track.kml',
      encoding: 'utf-8',
      mimetype: 'application/vnd.google-earth.kml+xml',
      size: 12345,
      destination: '/tmp/uploads',
      filename: 'unique-filename-123.kml',
      path: '/tmp/uploads/unique-filename-123.kml',
      buffer: Buffer.from('<kml xmlns="http://www.opengis.net"></kml>'),
      stream: new Readable()
    }
    const mockInsertResult: InsertResult = {
      identifiers: [
        {
          id: 'a6973d91-629f-4e10-aa28-016076a21fde'
        }
      ],
      generatedMaps: [
        {
          id: 'a6973d91-629f-4e10-aa28-016076a21fde',
          createdAd: new Date()
        }
      ],
      raw: {
        affectedRows: 1
      }
    }
    const track = {
      id: 'a6973d91-629f-4e10-aa28-016076a21fde',
      url: 'http://track.example.com',
      order: 1
    } as TrackEntity

    jest.spyOn(mockLogService, 'find').mockReturnValue(log)
    jest.spyOn(mockTrackRepository, 'create').mockReturnValue(track)
    jest.spyOn(mockTrackRepository, 'insert').mockReturnValue(mockInsertResult);

    const result = await service.create(logId, order, file);

    expect(result).toEqual(mockInsertResult)
    expect(mockTrackRepository.insert).toHaveBeenCalled();
    expect(mockTrackRepository.insert).toHaveBeenCalledWith({
      id: track.id,
      order: track.order,
      url: track.url
    })
  })

  it('create => should fail to find log', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const order = 1;
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test_track.kml',
      encoding: 'utf-8',
      mimetype: 'application/vnd.google-earth.kml+xml',
      size: 12345,
      destination: '/tmp/uploads',
      filename: 'unique-filename-123.kml',
      path: '/tmp/uploads/unique-filename-123.kml',
      buffer: Buffer.from('<kml xmlns="http://www.opengis.net"></kml>'),
      stream: new Readable()
    }

    jest.spyOn(mockLogService, 'find').mockReturnValue(undefined);

    try {
      await service.create(logId, order, file);

      fail('find failed to throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect(mockLogService.find).toHaveBeenCalled();
      expect(mockLogService.find).toHaveBeenCalledWith(logId);
    }
  })

  it('delete => should delete a track file', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde';
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const fileName = 'test_track.kml'
    const mockDeleteResult: DeleteResult ={
      raw: [],
      affected: 1
    }

    jest.spyOn(mockTrackRepository, 'delete').mockReturnValue(mockDeleteResult);

    const result = await service.delete(id, logId, fileName)

    expect(result).toEqual(mockDeleteResult);
    expect(mockTrackRepository.delete).toHaveBeenCalled();
    expect(mockTrackRepository.delete).toHaveBeenCalledWith({ id: id })
  })

  it('delete => should fail to delete file in file service', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde';
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const fileName = 'test_track.kml'

    jest.spyOn(mockFileService, 'deleteFile').mockRejectedValue(new Error('Failed to delete file'))

    try {
      await service.delete(id, logId, fileName)
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockFileService.deleteFile).toHaveBeenCalled();
      expect(mockFileService.deleteFile).toHaveBeenCalledWith('tracks', logId, fileName)
      expect(mockFileService.deleteFile).rejects.toThrow('Failed to delete file')
    }
  })

  it('downloadTrackFile => should download a track file by log id and filename', async () => {
    const logId: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const fileName = 'test_track.kml';
    const mockStreamToBufferString = 'fake-stream-to-buffer-string'

    jest.spyOn(mockFileService, 'downloadFile').mockReturnValue(mockStreamToBufferString);

    const result = await service.downloadTrackFile(logId, fileName);

    expect(result).toEqual(mockStreamToBufferString);
    expect(mockFileService.downloadFile).toHaveBeenCalled();
    expect(mockFileService.downloadFile).toHaveBeenCalledWith('tracks', logId, fileName);
  })

  it('find => should find a track file by id', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde';
    const track = {
      id: 'a6973d91-629f-4e10-aa28-016076a21fde',
      url: 'http://track.example.com',
      order: 1
    } as TrackEntity

    jest.spyOn(mockTrackRepository, 'findOneBy').mockReturnValue(track)

    const result = await service.find(id);

    expect(result).toEqual(track);
    expect(mockTrackRepository.findOneBy).toHaveBeenCalled();
    expect(mockTrackRepository.findOneBy).toHaveBeenCalledWith({ id: id })
  })

  it('findAll => should find all track files by log id', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const log = {
      id: '094ec69c-72c4-4995-8821-79d5b79bedda',
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
    const track = {
      id: 'a6973d91-629f-4e10-aa28-016076a21fde',
      url: 'http://track.example.com',
      order: 1
    } as TrackEntity;
    const tracks = [track]

    jest.spyOn(mockLogService, 'find').mockReturnValue(log)
    jest.spyOn(mockTrackRepository, 'find').mockReturnValue(tracks);

    const result = await service.findAll(logId);

    expect(result).toEqual(tracks);
    expect(mockTrackRepository.find).toHaveBeenCalled();
    expect(mockTrackRepository.find).toHaveBeenCalledWith(
      {
        where: {
          log: {
            id: logId 
          }
        }
      })
  })

  it('findAll => should fail to find log', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';

    jest.spyOn(mockLogService, 'find').mockReturnValue(undefined);

    try {
      await service.findAll(logId);

      fail('find failed to throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect(mockLogService.find).toHaveBeenCalled();
      expect(mockLogService.find).toHaveBeenCalledWith(logId);
    }
  })

  it('update => should update a track', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde';
    const track = {

    } as TrackDto;
    const mockUpdateResult: UpdateResult = {
      affected: 1,
      raw: [],
      generatedMaps: []
    }

    jest.spyOn(mockTrackRepository, 'update').mockReturnValue(mockUpdateResult)

    const result = await service.update(id, track);

    expect(result).toEqual(mockUpdateResult);
    expect(mockTrackRepository.update).toHaveBeenCalled();
    expect(mockTrackRepository.update).toHaveBeenCalledWith(id, track)
  })
})