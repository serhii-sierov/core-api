import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { AppRequest, GqlContext, WebSocketConnectionParams } from 'types';

import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext): AppRequest | WebSocketConnectionParams {
    const ctx = GqlExecutionContext.create(context);

    const { req, connectionParams } = ctx.getContext<GqlContext>();

    // console.log('AccessTokenGuard', req.cookies);

    return connectionParams ?? req;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // const ctx = GqlExecutionContext.create(context);

    // const { req } = ctx.getContext<GqlContext>();

    // console.log(req.cookies);

    return super.canActivate(context);
  }
}
