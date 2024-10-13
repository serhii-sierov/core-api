import { AppCookie } from '@constants';
import { Request as ExpressRequest } from 'express';

import { ContextUser } from './context-user';

export interface AppRequest extends ExpressRequest {
  cookies: {
    [key in AppCookie]?: string;
  };
  headers: {
    authorization?: string;
  };
  user?: ContextUser;
}
