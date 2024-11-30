import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';

export type NotifyFunction<T> = (value?: T | null) => Promise<void>;

export type SubscribeOptions<V, T> = {
  operationName: string;
  query: string;
  variables?: V;
  onNotify: NotifyFunction<T>;
};

export type ConnectionParams<P extends Record<string, unknown> = Record<string, unknown>> = P | (() => Promise<P> | P);

export interface GraphQLSubscriptionConnectionOptions {
  host: string;
  connectionParams?: ConnectionParams;
}

export interface GraphQLSubscriptionModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  provide: string;
  useFactory: (...args: any[]) => GraphQLSubscriptionConnectionOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  isGlobal?: boolean;
}
