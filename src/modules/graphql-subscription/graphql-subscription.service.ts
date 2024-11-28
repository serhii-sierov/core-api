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
  private readonly connectionDescription: string;

  constructor(
    private readonly connectionName: string,
    private readonly host: string,
    private readonly connectionParams: ConnectionParams,
    private readonly loggerService: LoggerService,
  ) {
    this.connectionDescription = `${this.connectionName} subscriptions`;
    this.client = createClient({
      url: `${this.host}/graphql`,
      connectionParams: this.connectionParams,
      shouldRetry: () => true,
      retryAttempts: Infinity,
      on: {
        connecting: () => {
          this.loggerService.log(DebugMessages.CONNECTING_TO_WEBSOCKET, this.connectionDescription);
        },
        connected: () => {
          this.loggerService.log(DebugMessages.CONNECTED_TO_WEBSOCKET, this.connectionDescription);
        },
        closed: () => {
          this.loggerService.log(DebugMessages.WEBSOCKET_CLOSED, this.connectionDescription);
        },
        error: error => {
          this.loggerService.error(
            `${ErrorMessage.WEBSOCKET_ERROR} ${JSON.stringify(serializeError(error))}`,
            this.connectionDescription,
          );
        },
      },

      webSocketImpl: WebSocket,
    });
    this.loggerService.log(`${this.connectionDescription} initialized`, GraphQLSubscriptionService.name);
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

      this.loggerService.error(errorMessage, this.connectionDescription);

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

    const subscriptionInfo = `Query: "${minimizedQuery}", Variables: ${JSON.stringify(variables)}`;

    this.loggerService.log(`${DebugMessages.SUBSCRIBING}: ${operationName}`, this.connectionDescription);
    this.loggerService.debug?.(subscriptionInfo, this.connectionDescription);

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

          this.loggerService.error(errorMessage, this.connectionDescription);
          this.loggerService.debug?.(subscriptionInfo, this.connectionDescription);

          throw new GraphQLError(errorMessage);
        },
        complete: () => {
          this.loggerService.log(
            `${DebugMessages.SUBSCRIPTION_COMPLETE}: ${operationName}`,
            this.connectionDescription,
          );
          this.loggerService.debug?.(subscriptionInfo, this.connectionDescription);
        },
      },
    );
  }
}
