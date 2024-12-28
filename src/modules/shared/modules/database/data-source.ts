import { Environments } from '@constants';
import * as dotenv from 'dotenv';
import * as pg from 'pg';
import { DataSource, DataSourceOptions } from 'typeorm';

import { patchQueryBuilder } from 'utils/typeorm';

import { NamingStrategy } from './naming-strategy';

import { databaseConfigLoader } from '../config/loaders';

dotenv.config();

// Enable parse decimals to numbers. We have to be sure that our data won't run into precision issues
pg.types.setTypeParser(1700, parseFloat);

// apply TypeORM patch to upstream bug
patchQueryBuilder();

export const config = (): DataSourceOptions => {
  const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;
  const isProductionEnvironment = process.env.NODE_ENV === Environments.PRODUCTION;
  const { url: dbUrl, testUrl, sslEnabled, loggingEnabled } = databaseConfigLoader().database;
  const url = isTestEnvironment ? testUrl : dbUrl;

  // when running migrations, determine directory / extension from the filename
  const [dir, ext] = RegExp(/(src|dist)\/modules\/shared\/modules\/database\/data-source\.(js|ts)/i)
    .exec(__filename)
    ?.slice(1) ?? ['dist', 'js'];

  return {
    type: 'postgres',
    url,
    logging: loggingEnabled,
    namingStrategy: new NamingStrategy(),
    ssl: isProductionEnvironment ? { rejectUnauthorized: false } : sslEnabled,
    synchronize: false,
    entities: [`${dir}/**/*.entity.${ext}`],
    subscribers: [`${dir}/**/*.subscriber.${ext}`],
    migrations: [`${dir}/modules/shared/modules/database/migrations/*.${ext}`],
  };
};

export const dataSource = new DataSource(config());
