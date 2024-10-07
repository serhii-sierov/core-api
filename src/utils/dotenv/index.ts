// eslint-disable-next-line import/no-unresolved -- path alias
import { DOCUMENTATION_URL } from '@constants';
import * as dotenv from 'dotenv';
import Joi from 'joi';

import { parseConnectionString } from 'utils';

// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// eslint-disable-next-line @typescript-eslint/naming-convention -- uppercase for constants
const connectionString = process.env.DATABASE_URL;

// eslint-disable-next-line @typescript-eslint/naming-convention -- uppercase for constants
const { host, port, database: name, username, password } = parseConnectionString(connectionString);

export const envVariables = {
  db: {
    host,
    port: port && String(port),
    name,
    username,
    password,
    url: connectionString,
  },
  isLocal: process.env.IS_LOCAL === 'true',
};

export const envValidationErrorFunction = (errors: Joi.ErrorReport[]) =>
  new Error(
    [
      ...errors,
      '\x1b[1m\x1b[31mMake sure the environment variables are set correctly\x1b[0m',
      `\x1b[1m\x1b[31m${DOCUMENTATION_URL}\x1b[0m`,
    ].join('\n '),
  );
