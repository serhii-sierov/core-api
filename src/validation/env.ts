import { Environments } from '@constants';
import * as Joi from 'joi';

import { envValidationErrorFunction } from 'utils';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.PRODUCTION),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .required(),
  TEST_DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .required(),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_SSL: Joi.boolean().default(false),

  REDIS_URL: Joi.string().uri().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

  LOG_LEVEL: Joi.string().default('info'),
})
  .when(Joi.object({ NODE_ENV: Joi.valid('production').required() }).unknown(), {
    then: Joi.object({
      // Required for production
    }).xor('ONE', 'TWO'),
  })
  .error(envValidationErrorFunction);
