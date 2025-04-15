import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from 'types';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Allow uppercase for decorator
export const OptionalCurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  // Simply return the user from the request (if it exists)
  return ctx.getContext<GqlContext>().req.user || null;
});
