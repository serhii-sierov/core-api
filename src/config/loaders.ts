import { ConfigFactory } from '@nestjs/config';

// import { DataSourceConfig, dataSourceConfig } from './data-source';
import { RedisConfig, redisConfig } from './redis';

export type Config = {
  redis: RedisConfig;
  // dataSource: DataSourceConfig;
};

export const configLoaders: ConfigFactory[] = [
  redisConfig,
  // dataSourceConfig
];
