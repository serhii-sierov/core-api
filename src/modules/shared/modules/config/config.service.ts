import { Environments } from '@constants';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseEnvironmentVariables } from './environment-variables';
import { DatabaseConfigLoader, JwtConfigLoader, RedisConfigLoader } from './loaders';

interface ConfigValues extends BaseEnvironmentVariables, RedisConfigLoader, JwtConfigLoader, DatabaseConfigLoader {}

@Injectable()
export class AppConfigService extends ConfigService<ConfigValues, true> {
  get<T extends keyof ConfigValues>(property: T): ConfigValues[T] {
    return super.get(property);
  }

  isProduction(): boolean {
    return this.get('NODE_ENV') === Environments.PRODUCTION;
  }

  isTest(): boolean {
    return this.get('NODE_ENV') === Environments.TEST;
  }
}
