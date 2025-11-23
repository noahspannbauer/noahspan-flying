import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'better-sqlite3',
  database: configService.get<string>('DB_PATH'),
  entities: ['../**/*.entity.js'],
  migrations: ['./migrations/*.js'],
  synchronize: configService.get<boolean>('DB_SYNC')
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;