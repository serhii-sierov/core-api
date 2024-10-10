import { Request } from 'express';

import { ContextUserType } from './context-user';

export interface CustomRequest {
  headers: {
    authorization?: string;
    token?: string;
  };
  cookies: {
    token?: string;
  };
  user?: ContextUserType;
}

export type ExtendedRequest = Request & CustomRequest;
