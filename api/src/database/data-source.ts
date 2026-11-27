import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

const configService = new ConfigService();

export const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: configService.get<string>('DB_PATH'),
  entities: ['../**/*.entity.js'],
  migrations: ['./migrations/*.js'],
  migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN'),
  synchronize: configService.get<boolean>('DB_SYNC'),
  
}

const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);

export default dataSource;