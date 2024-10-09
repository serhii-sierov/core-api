import { ModuleMetadata } from '@nestjs/common';

export type DataObject<T, K extends string> = {
  [Key in K]: T | null;
};

export type SubscribeOptions<V, T> = {
  operationName: string;
  query: string;
  variables?: V;
  onNotify: (value: T) => Promise<void>;
};

export type ConnectionParams<P extends Record<string, unknown> = Record<string, unknown>> = P | (() => Promise<P> | P);

export interface GraphQLSubscriptionConnectionOptions {
  host: string;
  connectionParams?: ConnectionParams;
}

export interface GraphQLSubscriptionModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  provide: string;
  useFactory: (...args: any[]) => GraphQLSubscriptionConnectionOptions;
  inject?: any[];
}
