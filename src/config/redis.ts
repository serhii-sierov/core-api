import { parseConnectionString } from 'utils';

export const redisConfig = () => {
  const connectionString = process.env.REDIS_URL;
  const { protocol, ...credentials } = parseConnectionString(connectionString, { includeProtocolName: true });

  return {
    redis: {
      // parsed from connection string
      ...credentials,
      ...(protocol === 'rediss' && {
        tls: { rejectUnauthorized: false },
      }),
    },
  };
};

export type RedisConfig = ReturnType<typeof redisConfig>['redis'];
