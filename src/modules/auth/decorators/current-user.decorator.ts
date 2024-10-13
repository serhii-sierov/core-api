import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from 'types';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Allow uppercase for decorator
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);

  return ctx.getContext<GqlContext>().req.user;
});
