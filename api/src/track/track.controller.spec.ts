import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackDto } from './track.dto';
import { TrackEntity } from './track.entity';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { Readable } from 'stream';
import { DeleteResult, InsertResult } from 'typeorm';

describe('TrackController', () => {
  let controller: TrackController;

  const mockTrackService = {
    create: jest.fn(),
    delete: jest.fn(),
    downloadTrackFile: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        ConfigService,
        FileService,
        {
          provide: TrackService,
          useValue: mockTrackService
        }
      ]
    }).compile();

    controller = module.get<TrackController>(TrackController);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('findAll => should find all tracks by log id', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';
    const track = {
      id: 'a6973d91-629f-4e10-aa28-016076a21fde',
      url: 'http://track.example.com',
      order: 1
    } as TrackEntity
    const tracks = [track]

    jest.spyOn(mockTrackService, 'findAll').mockReturnValue(tracks);
    
    const result = await controller.findAll(logId);

    expect(result).toEqual(tracks);
    expect(mockTrackService.findAll).toHaveBeenCalled();
    expect(mockTrackService.findAll).toHaveBeenLastCalledWith(logId);
  })

  it('findAll => should fail to find all tracks by log id', async () => {
    const logId = '094ec69c-72c4-4995-8821-79d5b79bedda';

    jest.spyOn(mockTrackService, 'findAll').mockRejectedValue(new Error('Tracks not found'))

    try {
      await controller.findAll(logId);

      fail('findAll did not throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockTrackService.findAll).toHaveBeenCalled();
      expect(mockTrackService.findAll).rejects.toThrow('Tracks not found')
    }
  })

  it('create => create a track by a log id', async () => {
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

    jest.spyOn(mockTrackService, 'create').mockReturnValue(mockInsertResult);

    const result = await controller.create(logId, order, file);

    expect(result).toEqual(mockInsertResult);
    expect(mockTrackService.create).toHaveBeenCalled();
    expect(mockTrackService.create).toHaveBeenCalledWith(logId, order, file)
  })

  it('create => should fail to create a track by log id', async () => {
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

    jest.spyOn(mockTrackService, 'create').mockRejectedValue(new Error('Track failed to create'))

    try {
      await controller.create(logId, order, file)

      fail('create did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockTrackService.create).toHaveBeenCalled();
      expect(mockTrackService.create).toHaveBeenCalledWith(logId, order, file);
      expect(mockTrackService.create).rejects.toThrow('Track failed to create')
    }
  })

  it('delete => should delete a track by log id', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde'
    const logId: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const fileName = 'test_track.kml';
    const mockDeleteResult: DeleteResult ={
      raw: [],
      affected: 1
    }

    jest.spyOn(mockTrackService, 'delete').mockReturnValue(mockDeleteResult);

    const result = await controller.delete(id, fileName, logId);

    expect(result).toEqual(mockDeleteResult);
    expect(mockTrackService.delete).toHaveBeenCalled();
    expect(mockTrackService.delete).toHaveBeenCalledWith(id, logId, fileName);

  })

  it('delete => should fail to delete a track by log id', async () => {
    const id = 'a6973d91-629f-4e10-aa28-016076a21fde'
    const logId: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const fileName = 'test_track.kml';

    jest.spyOn(mockTrackService, 'delete').mockRejectedValue(new Error('Track failed to delete'));

    try {
      await controller.delete(id, fileName, logId);

      fail('delete did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockTrackService.delete).toHaveBeenCalled();
      expect(mockTrackService.delete).toHaveBeenCalledWith(id, logId, fileName);
      expect(mockTrackService.delete).rejects.toThrow('Track failed to delete')
    }
  })

  it('downloadTrack => should download a track by log id', async () => {
    const logId: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const fileName = 'test_track.kml';
    const mockStreamToBufferString = 'fake-stream-to-buffer-string'

    jest.spyOn(mockTrackService, 'downloadTrackFile').mockReturnValue(mockStreamToBufferString);

    const result = await controller.downloadTrack(logId, fileName);

    expect(result).toEqual(mockStreamToBufferString);
    expect(mockTrackService.downloadTrackFile).toHaveBeenCalled();
    expect(mockTrackService.downloadTrackFile).toHaveBeenCalledWith(logId, fileName)
  })

  it('downloadTrack => should fail to download a track by log id', async () => {
    const logId: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const fileName = 'test_track.kml';

    jest.spyOn(mockTrackService, 'downloadTrackFile').mockRejectedValue(new Error('Track failed to download'));

    try {
      await controller.downloadTrack(logId, fileName);

      fail('downloadTrack did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockTrackService.downloadTrackFile).toHaveBeenCalled();
      expect(mockTrackService.downloadTrackFile).toHaveBeenCalledWith(logId, fileName);
      expect(mockTrackService.downloadTrackFile).rejects.toThrow('Track failed to download')
    }
  })
})