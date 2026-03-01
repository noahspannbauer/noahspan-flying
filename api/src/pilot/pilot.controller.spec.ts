import { Test, TestingModule } from '@nestjs/testing';
import { PilotController } from "./pilot.controller";
import { PilotService } from './pilot.service';
import { PilotDto } from './pilot.dto';
import { PilotEntity } from './pilot.entity';
import { CustomError } from '../error/customError';
import { HttpException } from '@nestjs/common';

describe('PilotController', () => {
  let controller: PilotController;

  const mockPilotService = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PilotController],
      providers: [
        {
          provide: PilotService,
          useValue: mockPilotService
        }
      ]
    }).compile();

    controller = module.get<PilotController>(PilotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find => should find a pilot by id', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8'
    const pilot = {
      id: '39465ae3-7947-4cc2-b565-ca00a982fdd8',
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234',
      userId: 'user@example.com',
      logs: [],
      certificates: [],
      endorsements: [],
      medical: []
    } as PilotEntity;

    jest.spyOn(mockPilotService, 'find').mockReturnValue(pilot);

    const result = await controller.find(id);

    expect(result).toEqual(pilot);
    expect(mockPilotService.find).toHaveBeenCalled();
    expect(mockPilotService.find).toHaveBeenCalledWith(id)
  })


  it('find => should fail to find a pilot by id', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8'

    jest.spyOn(mockPilotService, 'find').mockRejectedValue(new Error('Pilot not found'));

    try {
      await controller.find(id);

      fail('find did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(mockPilotService.find).toHaveBeenCalled();
      expect(mockPilotService.find).toHaveBeenCalledWith(id);
      expect(mockPilotService.find).rejects.toThrow('Pilot not found')
    }
  })

  it('findAll => should find all pilots', async () => {
    const pilot = {
      id: '39465ae3-7947-4cc2-b565-ca00a982fdd8',
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234',
      userId: 'user@example.com',
      logs: [],
      certificates: [],
      endorsements: [],
      medical: []
    } as PilotEntity;
    const pilots = [pilot];

    jest.spyOn(mockPilotService, 'findAll').mockReturnValue(pilots);

    const result = await controller.findAll();

    expect(result).toEqual(pilots);
    expect(mockPilotService.findAll).toHaveBeenCalled();
  })

  it('findAll => should fail to find all pilots', async () => {    
    jest.spyOn(mockPilotService, 'findAll').mockRejectedValue(new Error('Pilots not found'));

    try {
      await controller.findAll();

      fail('findAll did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(mockPilotService.findAll).toHaveBeenCalled();
      expect(mockPilotService.findAll).rejects.toThrow('Pilots not found')
    }
  })

  it('create => should create a new pilot', async () => {
    const pilotDto = {
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234'
    } as PilotDto

    const pilot = {
      id: '39465ae3-7947-4cc2-b565-ca00a982fdd8',
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234',
      userId: 'user@example.com',
      logs: [],
      certificates: [],
      endorsements: [],
      medical: []
    } as PilotEntity

    jest.spyOn(mockPilotService, 'create').mockReturnValue(pilot);

    const result = await controller.create(pilotDto);

    expect(mockPilotService.create).toHaveBeenCalled();
    expect(mockPilotService.create).toHaveBeenCalledWith(pilotDto)
    expect(result).toEqual(pilot);
  })

  it('create => should fail to create a new pilot', async () => {
    const pilotDto = {
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234'
    } as PilotDto

    jest.spyOn(mockPilotService, 'create').mockRejectedValue(new Error('Pilot failed to create'));

    try {
      await controller.create(pilotDto);

      fail('create did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(mockPilotService.create).toHaveBeenCalled();
      expect(mockPilotService.create).toHaveBeenCalledWith(pilotDto);
      expect(mockPilotService.create).rejects.toThrow('Pilot failed to create')
    }
  })

  it('update => should update an existing pilot', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8'
    const pilotDto = {
      id: '39465ae3-7947-4cc2-b565-ca00a982fdd8',
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234'
    } as PilotDto

    jest.spyOn(mockPilotService, 'update').mockReturnValue(pilotDto);

    const result = await controller.update(id, pilotDto);

    expect(result).toEqual(pilotDto);
    expect(mockPilotService.update).toHaveBeenCalled();
    expect(mockPilotService.update).toHaveBeenCalledWith(id, pilotDto)
  })

  it('update => should fail to update an existing pilot', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8'
    const pilotDto = {
      id: '39465ae3-7947-4cc2-b565-ca00a982fdd8',
      name: 'Test pilot',
      address: '123 Any Street',
      city: 'Any Town',
      state: 'Minnesota',
      postalCode: '55123',
      email: 'user@example.com',
      phone: '555-555-1234'
    } as PilotDto

    jest.spyOn(mockPilotService, 'update').mockRejectedValue(new Error('Pilot failed to update'))

    try {
      await controller.update(id, pilotDto);

      fail('update function did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(mockPilotService.update).toHaveBeenCalled();
      expect(mockPilotService.update).toHaveBeenCalledWith(id, pilotDto);
      expect(mockPilotService.update).rejects.toThrow('Pilot failed to update')
    }
  })

  it('delete => should delete an existing pilot', async () => {
    const id = '39465ae3-7947-4cc2-b565-ca00a982fdd8';

    jest.spyOn(mockPilotService, 'delete');

    const result = await controller.delete(id);

    expect(mockPilotService.delete).toHaveBeenCalled();
    expect(mockPilotService.delete).toHaveBeenCalledWith(id);
  })

  it('delete => should fail to delete an existing pilot', async () => {
    const id = '39465ae3-7947-4cc2-b565-ca00a982fdd8';

    jest.spyOn(mockPilotService, 'delete').mockRejectedValue(new Error('Pilot failed to delete'));

    try {
      await controller.delete(id);

      fail('delete function did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(mockPilotService.delete).toHaveBeenCalled();
      expect(mockPilotService.delete).toHaveBeenCalledWith(id);
      expect(mockPilotService.delete).rejects.toThrow('Pilot failed to delete')
    }
  })
})