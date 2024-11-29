import { Environments } from '@constants';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

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
];

const prodModules = baseModules.concat([
  GraphQlModule,
  BullModule.forRootAsync({
    useFactory: (configService: AppConfigService) => {
      return {
        connection: {
          ...configService.get('redis'),
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
        },
      };
    },
    inject: [AppConfigService],
  }),
  // This is an example of how to use the GraphQLSubscriptionModule
  // GraphQLSubscriptionModule.registerAsync({
  //   provide: 'API1',
  //   useFactory: (configService: AppConfigService) => ({
  //     host: configService.get('API1_HOST'),
  //     connectionParams: { additional: { parameter: 'value' } },
  //   }),
  //   inject: [AppConfigService],
  //   isGlobal: true,
  // }),
  // GraphQLSubscriptionModule.registerAsync({
  //   provide: 'API2',
  //   useFactory: (configService: AppConfigService) => ({
  //     host: configService.get('API2_HOST'),
  //   }),
  //   inject: [AppConfigService],
  //   isGlobal: true,
  // }),
]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class SharedModule {}
