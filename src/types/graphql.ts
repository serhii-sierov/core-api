import { Response } from 'express';

import { ContextUserType } from './context-user';
import { ExtendedRequest } from './request';

export interface GqlContext {
  req: ExtendedRequest;
  res: Response;
  user?: ContextUserType;
}

export interface WebSocketConnectionParams {
  authorization: string;
}
