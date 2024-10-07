import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { Environments } from '@constants';

const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;

const baseModules = [ConfigModule /*, DatabaseModule, LoggerModule, QueueModule, CacheModule*/];

const prodModules = baseModules.concat([
  /*GraphQlModule*/
]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class CommonModule {}
