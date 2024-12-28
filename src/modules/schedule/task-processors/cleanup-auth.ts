import { Injectable } from '@nestjs/common';

import { SessionService } from 'modules/user/services';

import { TaskProcessor } from '../types';

@Injectable()
export class CleanupAuthTaskProcessor implements TaskProcessor {
  constructor(private readonly sessionService: SessionService) {}

  handle = (): Promise<void> => {
    return this.sessionService.deleteExpired();
  };
}
