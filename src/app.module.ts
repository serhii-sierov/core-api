import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [CommonModule, HealthModule],
  providers: [],
})
export class AppModule {}
