import { Environments } from '@constants';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configLoaders } from 'config';
import { envValidationSchema } from 'validation';

import { AppConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: process.env.NODE_ENV === Environments.TEST ? undefined : envValidationSchema,
      load: configLoaders,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
