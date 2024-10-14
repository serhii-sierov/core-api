import { GraphQLError } from '@graphql';
import { Injectable, LoggerService } from '@nestjs/common';
import { Client, createClient } from 'graphql-ws';
import { serializeError } from 'serialize-error';
import WebSocket from 'ws';

import { minimizeString } from 'utils';

import { DebugMessages, ErrorMessage } from './constants';
import { ConnectionParams, DataObject, NotifyFunction, SubscribeOptions } from './types';

@Injectable()
export class GraphQLSubscriptionService {
  private readonly client: Client;

  constructor(
    private readonly connectionName: string,
    private readonly host: string,
    private readonly connectionParams: ConnectionParams,
    private readonly loggerService: LoggerService,
  ) {
    this.client = createClient({
      url: `${this.host}/graphql`,
      connectionParams: this.connectionParams,
      shouldRetry: () => true,
      retryAttempts: Infinity,
      on: {
        connecting: () => {
          this.loggerService.log('info', DebugMessages.CONNECTING_TO_WEBSOCKET, { connection: this.connectionName });
        },
        connected: () => {
          this.loggerService.log('info', DebugMessages.CONNECTED_TO_WEBSOCKET, { connection: this.connectionName });
        },
        closed: () => {
          this.loggerService.log('info', DebugMessages.WEBSOCKET_CLOSED, { connection: this.connectionName });
        },
        error: error => {
          this.loggerService.error(`${ErrorMessage.WEBSOCKET_ERROR}:`, serializeError(error), {
            connection: this.connectionName,
          });
        },
      },

      webSocketImpl: WebSocket,
    });
    this.loggerService.log(`${this.connectionName} initialized`, GraphQLSubscriptionService.name);
  }

  public async closeConnection(): Promise<void> {
    return this.client.dispose();
  }

  private readonly handleSubscriptionNext = <T = unknown>(
    notifyFn: NotifyFunction<T>,
    dataKey: string,
    data?: DataObject<T, string>,
    errors?: GraphQLError[],
  ): void => {
    if (errors?.length) {
      const errorMessage = `${ErrorMessage.UNEXPECTED_WEBSOCKET_ERROR}: ${JSON.stringify(serializeError(errors))}`;

      this.loggerService.error(errorMessage, { connection: this.connectionName });

      throw new GraphQLError(JSON.stringify(errorMessage));
    }

    if (data) {
      void notifyFn(data[dataKey]);
    }
  };

  subscribe<T = unknown, V extends Record<string, unknown> = Record<string, unknown>>({
    operationName,
    query,
    variables,
    onNotify,
  }: SubscribeOptions<V, T>): () => void {
    const minimizedQuery = minimizeString(query);
    const queryWithVariables = { query: minimizedQuery, variables };

    this.loggerService.debug?.(`${DebugMessages.SUBSCRIBING}: ${operationName}`, {
      ...queryWithVariables,
      connection: this.connectionName,
    });

    return this.client.subscribe<T>(
      {
        query,
        variables,
      },
      {
        next: ({ data, errors }) => this.handleSubscriptionNext<T>(onNotify, operationName, data, errors),
        error: error => {
          const errorMessage = `${ErrorMessage.SUBSCRIPTION_ERROR} (${operationName}): ${JSON.stringify(
            serializeError(error),
          )}`;

          this.loggerService.error(errorMessage, { ...queryWithVariables, connection: this.connectionName });

          throw new GraphQLError(errorMessage);
        },
        complete: () => {
          this.loggerService.debug?.(`${DebugMessages.SUBSCRIPTION_COMPLETE}: ${operationName}`, {
            ...queryWithVariables,
            connection: this.connectionName,
          });
        },
      },
    );
  }
}
