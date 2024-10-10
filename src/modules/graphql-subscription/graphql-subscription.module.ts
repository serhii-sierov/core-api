import { DynamicModule, Logger, Module } from '@nestjs/common';

import { GRAPHQL_SUBSCRIPTION_CONFIG_PROVIDER } from './constants';
import { GraphQLSubscriptionService } from './graphql-subscription.service';
import { GraphQLSubscriptionConnectionOptions, GraphQLSubscriptionModuleAsyncOptions } from './types';

@Module({})
export class GraphQLSubscriptionModule {
  static registerAsync(options: GraphQLSubscriptionModuleAsyncOptions): DynamicModule {
    const providers = [
      Logger,
      {
        provide: GRAPHQL_SUBSCRIPTION_CONFIG_PROVIDER,
        useFactory: (...args) => options.useFactory(...args),
        inject: options.inject || [],
      },
      {
        provide: options.provide,
        useFactory: (logger: Logger, config: GraphQLSubscriptionConnectionOptions) =>
          new GraphQLSubscriptionService(
            options.provide, // connectionName
            config.host,
            config.connectionParams || {},
            logger,
          ),
        inject: [Logger, GRAPHQL_SUBSCRIPTION_CONFIG_PROVIDER],
      },
    ];

    return {
      module: GraphQLSubscriptionModule,
      imports: options.imports || [],
      providers,
      exports: [options.provide],
      global: options.isGlobal,
    };
  }
}
