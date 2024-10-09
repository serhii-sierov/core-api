import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { GraphQLSubscriptionService } from 'modules/graphql-subscription';

@Injectable()
export class HealthService {
  constructor(
    @Inject('API1') private readonly graphQLSubscriptionService1: GraphQLSubscriptionService,
    @Inject('API2') private readonly graphQLSubscriptionService2: GraphQLSubscriptionService,
  ) {}

  getAppVersion(): string {
    let appVersion = '';

    try {
      appVersion = JSON.parse(readFileSync('./package.json', 'utf-8'))?.version ?? '';
    } catch (error) {
      throw new Error((error as Error).message);
    }

    return appVersion;
  }
}
