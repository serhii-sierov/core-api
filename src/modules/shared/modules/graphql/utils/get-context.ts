import { Cache } from '@nestjs/cache-manager';
import { LoggerService } from '@nestjs/common';
import { ContextFunction } from 'apollo-server-core';
import { Response } from 'express';

import { ExtendedRequest, GqlContext, WebSocketConnectionParams } from 'types';

import { AppConfigService } from '../../config/config.service';

export type ContextParams = {
  req: ExtendedRequest;
  res: Response;
  connectionParams?: WebSocketConnectionParams;
  loggerService: LoggerService;
  configService: AppConfigService;
  cacheManager: Cache;
};

export const getContext: ContextFunction<ContextParams, GqlContext> = ({
  req,
  res,
  connectionParams,
  loggerService,
  // configService,
  // cacheManager,
}): GqlContext => {
  try {
    const context: GqlContext = { req, res };

    if (connectionParams) {
      return context;
    }

    return context;
  } catch (error) {
    loggerService.error(error);

    throw error;
  }
};
