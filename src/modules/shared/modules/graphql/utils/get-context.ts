import { Cache } from '@nestjs/cache-manager';
import { LoggerService } from '@nestjs/common';
import { Response } from 'express';

import { AppRequest, GqlContext, WebSocketConnectionParams } from 'types';

import { AppConfigService } from '../../config/config.service';

export type ContextParams = {
  req: AppRequest;
  res: Response;
  connectionParams?: WebSocketConnectionParams;
  loggerService: LoggerService;
  configService: AppConfigService;
  cacheManager: Cache;
};

export const getContext = ({
  req,
  res,
  connectionParams,
  loggerService,
  // configService,
  // cacheManager,
}: ContextParams): GqlContext => {
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
