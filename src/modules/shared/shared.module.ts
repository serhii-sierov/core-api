import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config';
import { Environments } from '@constants';
import { LoggerModule } from './modules/logger/logger.module';
import { GraphQlModule } from './modules/graphql/graphql.module';
import { CacheModule } from './modules/cache';

const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;

const baseModules = [ConfigModule, LoggerModule, CacheModule /*, DatabaseModule, QueueModule*/];

const prodModules = baseModules.concat([GraphQlModule]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class SharedModule {}
