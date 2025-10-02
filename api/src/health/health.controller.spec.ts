import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller; HealthController;

  const mockHealthService = {
    isDatabaseConnected: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService]
    }).compile();

    controller = module.get<HealthController>(HealthController);
  })

  it('isHealthy => should return true', () => {
    expect(controller).toBeDefined();
  });

  it('should return database connected', async () => {
    jest.spyOn(mockHealthService, 'isDatabaseConnected').mockReturnValue(true);

    const result = await controller.isHealthy();

    expect(mockHealthService.isDatabaseConnected).toHaveBeenCalled();
    expect(result).toEqual(true);
  })

  it('isHealthy => should return error', async () => {
    jest.spyOn(mockHealthService, 'isDatabaseConnected').mockReturnValue(false);

    const result = await controller.isHealthy();

    expect(mockHealthService.isDatabaseConnected).toHaveBeenCalled();
    expect(result).toEqual(false);
  })
})