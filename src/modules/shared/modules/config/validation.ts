import { Environments } from '@constants';
import * as Joi from 'joi';

import { envValidationErrorFunction } from 'utils';

import { EnvironmentVariables } from './environment-variables';

export const envValidationSchema = Joi.object<EnvironmentVariables, true>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.DEVELOPMENT),
  GIT_COMMIT: Joi.string(),

  PORT: Joi.number().default(3000),

  REDIS_URL: Joi.string()
    .uri({ scheme: /rediss?/ })
    .required(),

  LOG_LEVEL: Joi.string().default('info'),
  DEBUG: Joi.boolean().default(false),

  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .required(),
  TEST_DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .default('postgres://root:root@postgres:5432/core_api_test'),

  DB_LOGGING: Joi.boolean().default(false),
  DB_SSL: Joi.boolean().default(false),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES: Joi.string().default('30d'),
})
  .when(Joi.object({ NODE_ENV: Joi.valid('production').required() }).unknown(), {
    then: Joi.object({
      // Required for production
    }).xor('ONE', 'TWO'),
  })
  .error(envValidationErrorFunction);
