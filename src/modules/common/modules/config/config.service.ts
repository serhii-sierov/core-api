import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'types';
import { LeafTypes, Leaves } from './types';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends Leaves<EnvironmentVariables>>(propertyPath: T): LeafTypes<EnvironmentVariables, T> {
    return this.configService.get(propertyPath);
  }
}
