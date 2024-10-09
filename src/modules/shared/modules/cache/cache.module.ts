import { CacheStore, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisClientOptions } from 'redis';

import { ConfigModule, AppConfigService } from '../config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
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
