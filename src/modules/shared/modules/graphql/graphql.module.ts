// import { GraphQLError } from '@graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { GraphQLFormattedError } from 'graphql';
import { GqlContext } from 'types';
import { isProduction } from 'utils';

import { ContextParams, getContext } from './utils';

import { AppConfigService } from '../config';

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: AppConfigService, cacheManager: Cache, loggerService: LoggerService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          introspection: !isProduction(configService),
          playground: !isProduction(configService),
          subscriptions: { 'graphql-ws': true },
          context: (contextParams: ContextParams): GqlContext =>
            getContext({
              ...contextParams,
              loggerService,
              configService,
              cacheManager,
            }),
          formatError: (formattedError: GraphQLFormattedError): GraphQLFormattedError => {
            // Pass through validation errors and bad request errors
            if (formattedError.extensions?.code === 'BAD_USER_INPUT') {
              return formattedError;
            }

            loggerService.error('GraphQL Error:', formattedError);

            // For other types of errors, return a generic error message
            return {
              message: 'An error occurred',
              extensions: { code: 'INTERNAL_SERVER_ERROR' },
            };
          },
        };
      },
      imports: [],
      inject: [AppConfigService, CACHE_MANAGER],
    }),
  ],
})
export class GraphQlModule {}
