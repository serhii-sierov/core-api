// eslint-disable-next-line import/no-unresolved -- path alias
import { DOCUMENTATION_URL } from '@constants';
import Joi from 'joi';

export const envValidationErrorFunction = (errors: Joi.ErrorReport[]): Error =>
  new Error(
    [
      ...errors,
      '\x1b[1m\x1b[31mMake sure the environment variables are set correctly\x1b[0m',
      `\x1b[1m\x1b[31m${DOCUMENTATION_URL}\x1b[0m`,
    ].join('\n '),
  );
