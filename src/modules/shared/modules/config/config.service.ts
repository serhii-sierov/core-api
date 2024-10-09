import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'types';
import { LeafTypes, Leaves } from './types';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<K extends keyof EnvironmentVariables>(propertyPath: K): LeafTypes<EnvironmentVariables, K>;
  get<T extends Leaves<EnvironmentVariables>>(propertyPath: T): LeafTypes<EnvironmentVariables, T>;
  get(propertyPath: string): unknown {
    return this.configService.get(propertyPath);
  }
}
