import { Module } from '@nestjs/common';

import { AccessTokenGuard } from 'modules/auth/guards/accessToken.guard';
import { HealthModule } from 'modules/health';

import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [SharedModule, HealthModule, UserModule, AuthModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
