// import { GraphQLError } from '@graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService, Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
// import { JsonWebTokenError } from 'jsonwebtoken';
import { join } from 'path';

// import { ErrorMessage } from 'modules/users/types';
import { isProduction } from 'utils';

import { ContextParams, getContext } from './utils';

import { AppConfigService } from '../config';

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: AppConfigService, cacheManager: Cache, loggerService: LoggerService) => {
        return {
          context: (contextParams: ContextParams) =>
            getContext({
              ...contextParams,
              loggerService,
              configService,
              cacheManager,
            }),
          //   formatError: (formattedError, error) => {
          //     const { originalError } = error as GraphQLError;
          //     let { message } = formattedError;

          //     if (originalError instanceof JsonWebTokenError) {
          //       message = ErrorMessage.NOT_AUTHORIZED_ERROR;
          //     }

          //     return { message };
          //   },
          typePaths: ['./**/*.graphql'],
          introspection: !isProduction(configService),
          playground: !isProduction(configService),
          definitions: {
            path: join(process.cwd(), 'src/graphql.ts'),
            outputAs: 'interface',
          },
          resolvers: {
            JSON: GraphQLJSON,
          },
          subscriptions: {
            'graphql-ws': true,
          },
        };
      },
      imports: [],
      inject: [AppConfigService, CACHE_MANAGER],
    }),
  ],
})
export class GraphQlModule {}
