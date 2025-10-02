import { Injectable } from '@nestjs/common';
import { CustomError } from '../error/customError';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private dataSource: DataSource) {}

  async isDatabaseConnected(): Promise<boolean> {
    try {
      const isDatabaseConnected: boolean = this.dataSource.isInitialized;

      if (isDatabaseConnected) {
        return isDatabaseConnected;
      } else {
        throw new CustomError('Database not connected', 'Database not connected', 400)
      }
    } catch (error) {
      throw error;
    }
  }
}
