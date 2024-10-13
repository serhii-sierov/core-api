import { Response } from 'express';

import { AppRequest } from './app-request';
import { ContextUser } from './context-user';

export interface GqlContext {
  req: AppRequest;
  res: Response;
  connectionParams?: WebSocketConnectionParams;
  user?: ContextUser;
}

export interface WebSocketConnectionParams {
  authorization: string;
}
