import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configLoaders } from 'config';
import { Environments } from '@constants';
import { envValidationSchema } from 'validation';
import { TypedConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: process.env.NODE_ENV === Environments.TEST ? undefined : envValidationSchema,
      load: configLoaders,
    }),
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService],
})
export class ConfigModule {}
