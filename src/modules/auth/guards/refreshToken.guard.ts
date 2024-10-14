import { Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { AppRequest, GqlContext } from 'types';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContextHost): AppRequest {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext<GqlContext>().req;
  }
}
