import { Module } from '@nestjs/common';

import { HealthModule } from 'modules/health';

import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [SharedModule, HealthModule, UserModule],
  providers: [],
})
export class AppModule {}
