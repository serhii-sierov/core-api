import { Environments } from '@constants';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { GraphQLSubscriptionModule } from 'modules/graphql-subscription';

import { CacheModule } from './modules/cache';
import { AppConfigModule, AppConfigService } from './modules/config';
import { DatabaseModule } from './modules/database';
import { GraphQlModule } from './modules/graphql';
import { LoggerModule } from './modules/logger';

const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;

const baseModules: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [
  AppConfigModule,
  LoggerModule,
  CacheModule,
  DatabaseModule,
  // QueueModule,
];

const prodModules = baseModules.concat([
  GraphQlModule,
  GraphQLSubscriptionModule.registerAsync({
    provide: 'API1',
    useFactory: (configService: AppConfigService) => ({
      host: configService.get('DATABASE_URL'),
      connectionParams: { additional: { parameter: 'value' } },
    }),
    inject: [AppConfigService],
    isGlobal: true,
  }),
  GraphQLSubscriptionModule.registerAsync({
    provide: 'API2',
    useFactory: (configService: AppConfigService) => ({
      host: configService.get('DATABASE_URL'),
    }),
    inject: [AppConfigService],
    isGlobal: true,
  }),
]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class SharedModule {}
