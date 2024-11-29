import { Environments } from '@constants';

import { DatabaseEnvironmentVariables, JwtEnvironmentVariables, RedisEnvironmentVariables } from './loaders';

export interface BaseEnvironmentVariables {
  NODE_ENV: Environments;
  GIT_COMMIT: string;
  PORT: number;

  LOG_LEVEL: string;
  DEBUG: boolean;
}

export interface EnvironmentVariables
  extends BaseEnvironmentVariables,
    DatabaseEnvironmentVariables,
    JwtEnvironmentVariables,
    RedisEnvironmentVariables {}
