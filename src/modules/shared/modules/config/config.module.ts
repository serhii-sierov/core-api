import { Environments } from '@constants';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './config.service';
import { databaseConfigLoader, jwtConfigLoader, redisConfigLoader } from './loaders';
import { envValidationSchema } from './validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: process.env.NODE_ENV === Environments.TEST ? undefined : envValidationSchema,
      load: [jwtConfigLoader, redisConfigLoader, databaseConfigLoader],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
