import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import configuration from './configuration';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: configService.get<string>('DB_PATH'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: configService.get<boolean>('DB_SYNC')
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;