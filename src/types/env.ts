import { Config } from 'config';

import { Environments } from '@constants';

export type EnvironmentVariables = Config & {
  NODE_ENV: Environments;
  GIT_COMMIT: string;
  ENVIRONMENT: Environments;
  PORT: number;

  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
  DATABASE_LOGGING: string;
  DATABASE_SSL: string;
  IS_LOCAL: boolean;

  npm_package_version: string; //predefined by node from package.json

  DEBUG: boolean;
};
