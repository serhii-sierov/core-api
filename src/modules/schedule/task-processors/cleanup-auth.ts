import { Injectable } from '@nestjs/common';

import { RefreshTokenService } from 'modules/auth/services';

import { TaskProcessor } from '../types';

@Injectable()
export class CleanupAuthTaskProcessor implements TaskProcessor {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  handle = (): Promise<void> => {
    return this.refreshTokenService.cleanupExpiredTokens();
  };
}
