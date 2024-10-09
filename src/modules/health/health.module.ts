import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { GraphQLSubscriptionModule } from 'modules/graphql-subscription';

@Module({
  imports: [GraphQLSubscriptionModule],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
