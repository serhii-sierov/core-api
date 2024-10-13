import { ConfigFactory } from '@nestjs/config';

import { JwtConfig, jwtConfig } from './jwt';
import { RedisConfig, redisConfig } from './redis';

// import { DataSourceConfig, dataSourceConfig } from './data-source';

export type Config = {
  redis: RedisConfig;
  jwt: JwtConfig;
  // dataSource: DataSourceConfig;
};

export const configLoaders: ConfigFactory[] = [
  redisConfig,
  jwtConfig,
  // dataSourceConfig
];
