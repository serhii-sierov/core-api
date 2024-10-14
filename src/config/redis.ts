import { parseConnectionString } from 'utils';

export type RedisConfig = {
  host: string;
  port: number;
  database?: string;
  username?: string;
  password?: string;
  tls?: { rejectUnauthorized: boolean };
};

export const redisConfig = (): { redis: RedisConfig } => {
  const connectionString = process.env.REDIS_URL;
  const { protocol, ...credentials } = parseConnectionString(connectionString, { includeProtocolName: true });

  return {
    redis: {
      host: 'redis',
      port: 6379,
      // parsed from connection string
      ...credentials,
      ...(protocol === 'rediss' && {
        tls: { rejectUnauthorized: false },
      }),
    },
  };
};
