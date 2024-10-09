import { Module } from '@nestjs/common';
import { SharedModule } from './modules/shared/shared.module';
import { HealthModule } from 'modules/health';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [SharedModule, HealthModule, UserModule],
  providers: [],
})
export class AppModule {}
