import * as dotenv from 'dotenv';

dotenv.config();

export interface DatabaseEnvironmentVariables {
  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
  DB_LOGGING: boolean;
  DB_SSL: boolean;
}

export type DatabaseConfig = {
  url: string;
  testUrl: string;
  sslEnabled: boolean;
  loggingEnabled: boolean;
};

export interface DatabaseConfigLoader {
  database: DatabaseConfig;
}

export const databaseConfigLoader = (): DatabaseConfigLoader => ({
  database: {
    url: process.env.DATABASE_URL!,
    testUrl: process.env.TEST_DATABASE_URL!,
    sslEnabled: process.env.DB_SSL === 'true',
    loggingEnabled: process.env.DB_LOGGING === 'true',
  },
});
