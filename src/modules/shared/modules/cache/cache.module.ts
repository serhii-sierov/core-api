import { CacheStore, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisClientOptions } from 'redis';

import { AppConfigModule, AppConfigService } from '../config';

@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => {
        const socket = configService.get('redis');

        return {
          store: (await redisStore(socket)) as unknown as CacheStore,
        };
      },
    }),
  ],
})
export class CacheModule {}
