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
    findAll: jest.fn(),
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
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const log = {

    } as LogEntity

    jest.spyOn(mockLogService, 'find').mockReturnValue(log);

    const result = await controller.find(id);

    expect(result).toEqual(log);
    expect(mockLogService.find).toHaveBeenCalled();
    expect(mockLogService.find).toHaveBeenCalledWith(id);
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

  it('findAll => should find all logs', async () => {
    const id: string = '95834f84-0a02-44d3-884e-a20237adeca0';
    const log = {

    } as LogEntity;
    const logs = [log]

    jest.spyOn(mockLogService, 'findAll').mockReturnValue(logs);

    const result = await controller.findAll();

    expect(result).toEqual(logs);
    expect(mockLogService.findAll).toHaveBeenCalled();
  })

  it('findAll => should fail to find all logs', async () => {
    jest.spyOn(mockLogService, 'findAll').mockRejectedValue(new Error('Logs not found'))

    try {
      await controller.findAll();

      fail('findAll did not throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockLogService.findAll).toHaveBeenCalled();
      expect(mockLogService.findAll).rejects.toThrow('Logs not found')
    }
  })

  it('create => should create a new log', async () => {
    const logDto = {

    } as LogDto;

    const log = {

    } as LogEntity;

    jest.spyOn(mockLogService, 'create').mockReturnValue(log);

    const result = await controller.create(logDto);

    expect(mockLogService.create).toHaveBeenCalled();
    expect(mockLogService.create).toHaveBeenCalledWith(logDto);
    expect(result).toEqual(log);
  })

  it('create => should failt to create a new log', async () => {
    const logDto = {

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