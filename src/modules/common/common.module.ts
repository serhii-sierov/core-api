import { Module } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { Environments } from '@constants';
import { LoggerModule } from './modules/logger/logger.module';

const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;

const baseModules = [ConfigModule, LoggerModule /*, DatabaseModule, QueueModule, CacheModule*/];

const prodModules = baseModules.concat([
  /*GraphQlModule*/
]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class CommonModule {}
