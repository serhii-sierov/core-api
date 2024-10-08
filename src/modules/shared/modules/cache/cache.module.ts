import { CacheStore, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisClientOptions } from 'redis';

import { ConfigModule } from '../config/config.module';
import { TypedConfigService } from '../config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [TypedConfigService],
      useFactory: async (configService: TypedConfigService) => {
        const socket = configService.get('redis');

        return {
          store: (await redisStore(socket)) as unknown as CacheStore,
        };
      },
    }),
  ],
})
export class CacheModule {}
