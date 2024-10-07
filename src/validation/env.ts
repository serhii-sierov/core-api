import { Environments } from '@constants';
import * as Joi from 'joi';

import { envValidationErrorFunction } from 'utils';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environments))
    .default(Environments.PRODUCTION),
  ENVIRONMENT: Joi.string().valid(...Object.values(Environments)),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .required(),
  TEST_DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/] })
    .required(),

  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_SSL: Joi.boolean().default(false),

  LOG_LEVEL: Joi.string().default('info'),
})
  .when(Joi.object({ ENVIRONMENT: Joi.valid('production').required() }).unknown(), {
    then: Joi.object({
      // Required for production
    }).xor('ON', 'TWO'),
  })
  .error(envValidationErrorFunction);
