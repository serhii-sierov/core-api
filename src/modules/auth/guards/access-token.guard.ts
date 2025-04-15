import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

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

    return connectionParams ?? req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // For public routes, try to extract the user but don't require authentication
      await this.extractUserOptionally(context);

      return true;
    }

    // For protected routes, require authentication
    return super.canActivate(context) as Promise<boolean>;
  }

  private async extractUserOptionally(context: ExecutionContext): Promise<void> {
    try {
      // Try to authenticate and extract user from token without throwing errors
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext<GqlContext>().req;

      if (req.cookies.accessToken) {
        // Use the guard's authentication mechanism directly
        await super.canActivate(context);
      }
    } catch (error: unknown) {
      // Ignore authentication errors for public routes
      console.log('Optional auth failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
