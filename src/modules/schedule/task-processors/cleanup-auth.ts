import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { RefreshTokenService } from 'modules/auth/services';

import { TaskProcessor } from '../types';

@Injectable()
export class CleanupAuthTaskProcessor implements TaskProcessor {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
  ) {}

  handle = async (): Promise<void> => {
    this.loggerService.debug?.('CleanupAuthTaskProcessor: Start cleanup', this.constructor.name);

    return this.refreshTokenService.cleanupExpiredTokens();
  };
}
