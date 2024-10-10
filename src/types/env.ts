import { Environments } from '@constants';

import { Config } from 'config';

export type EnvironmentVariables = Config & {
  NODE_ENV: Environments;
  GIT_COMMIT: string;
  ENVIRONMENT: Environments;
  PORT: number;

  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
  DATABASE_LOGGING: boolean;
  DATABASE_SSL: boolean;
  IS_LOCAL: boolean;

  npm_package_version: string; //predefined by node from package.json

  LOG_LEVEL: string;
};
