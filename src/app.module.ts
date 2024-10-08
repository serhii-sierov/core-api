import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared/shared.module';
import { HealthModule } from 'modules/health';

@Module({
  imports: [SharedModule, HealthModule],
  providers: [],
})
export class AppModule {}
