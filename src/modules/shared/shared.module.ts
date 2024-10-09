import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule, TypedConfigService } from './modules/config';
import { Environments } from '@constants';
import { CacheModule } from './modules/cache';
import { LoggerModule } from './modules/logger';
import { GraphQlModule } from './modules/graphql';
import { GraphQLSubscriptionModule } from 'modules/graphql-subscription';
import { DatabaseModule } from './modules/database';

const isTestEnvironment = process.env.NODE_ENV === Environments.TEST;

const baseModules: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [
  ConfigModule,
  LoggerModule,
  CacheModule,
  DatabaseModule,
  // QueueModule,
];

const prodModules = baseModules.concat([
  GraphQlModule,
  GraphQLSubscriptionModule.registerAsync({
    provide: 'API1',
    useFactory: (configService: TypedConfigService) => ({
      host: configService.get('DATABASE_URL'),
      connectionParams: { additional: { parameter: 'value' } },
    }),
    inject: [TypedConfigService],
    isGlobal: true,
  }),
  GraphQLSubscriptionModule.registerAsync({
    provide: 'API2',
    useFactory: (configService: TypedConfigService) => ({
      host: configService.get('DATABASE_URL'),
    }),
    inject: [TypedConfigService],
    isGlobal: true,
  }),
]);

@Module({
  imports: isTestEnvironment ? baseModules : prodModules,
})
export class SharedModule {}
