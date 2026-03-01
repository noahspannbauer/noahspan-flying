import { Test, TestingModule } from '@nestjs/testing';
import { PilotService } from './pilot.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PilotEntity } from './pilot.entity';
import { PilotDto } from './pilot.dto';
import { CustomError } from '../error/customError';

describe('PilotService', () => {
  let service: PilotService;

  const mockPilotRepository = {
    delete: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PilotService,
        {
          provide: getRepositoryToken(PilotEntity),
          useValue: mockPilotRepository
        }
      ]
    }).compile();

    service = module.get<PilotService>(PilotService);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('find => should find one pilot by id', async () => {
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

    jest.spyOn(mockPilotRepository, 'findOneBy').mockReturnValue(pilot);

    const result = await service.find(id);

    expect(result).toEqual(pilot);
    expect(mockPilotRepository.findOneBy).toHaveBeenCalled();
    expect(mockPilotRepository.findOneBy).toHaveBeenCalledWith({ id: id });
  })

  it('find => should fail to find one pilot by id', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8';
    const mockCustomError = new CustomError('Pilot not found', 'Not found', 404)

    jest.spyOn(mockPilotRepository, 'findOneBy').mockReturnValue(undefined);

    try {
      await service.find(id);

      fail('find did not throw error')
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect(mockPilotRepository.findOneBy).toHaveBeenCalled();
      expect(mockPilotRepository.findOneBy).toHaveBeenCalledWith({ id: id });
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

    jest.spyOn(mockPilotRepository, 'find').mockReturnValue(pilots);

    const result = await service.findAll();

    expect(result).toEqual(pilots);
    expect(mockPilotRepository.find).toHaveBeenCalled()
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

    jest.spyOn(mockPilotRepository, 'save').mockReturnValue(pilot);

    const result = await service.create(pilotDto);

    expect(mockPilotRepository.save).toHaveBeenCalled();
    expect(mockPilotRepository.save).toHaveBeenCalledWith(pilotDto);
  })

  it('update => should update a pilot', async () => {
    const id: string = '39465ae3-7947-4cc2-b565-ca00a982fdd8'
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

    jest.spyOn(mockPilotRepository, 'findOneBy').mockReturnValue(pilot)
    jest.spyOn(mockPilotRepository, 'save').mockReturnValue(pilotDto);

    const result = await service.update(id, pilotDto)

    expect(result).toEqual(pilotDto);
    expect(mockPilotRepository.findOneBy).toHaveBeenCalled();
    expect(mockPilotRepository.findOneBy).toHaveBeenCalledWith({ id: id });
    expect(mockPilotRepository.save).toHaveBeenCalled();
    expect(mockPilotRepository.save).toHaveBeenCalledWith(pilotDto)
  })

  it('delete => should delete a pilot', async () => {
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
    } as PilotEntity

    jest.spyOn(mockPilotRepository, 'delete').mockReturnValue(pilot);

    const result = await service.delete(id);

    expect(result).toEqual(pilot);
    expect(mockPilotRepository.delete).toHaveBeenCalled();
    expect(mockPilotRepository.delete).toHaveBeenCalledWith({ id: id });
  })
})