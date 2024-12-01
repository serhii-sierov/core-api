import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from 'types';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Naming convention enforced by NestJS
export const IpAddress = createParamDecorator<never, ExecutionContext>((data, context): string | undefined => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext<GqlContext>().req;

  // Temporary replacing '::ffff:' with an empty string to make the output more readable.
  // It is important to start addressing IP addresses using the IPv6 namespace and therefore include
  // the ::ffff: in your code because in the future there will be real hexadecimal data between those colons.
  // If you strip it off for aesthetic reasons, your code will break when it switches to an IPv6 network
  // or it's confronted with an IPv6 address.
  // https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
  return req.clientIp?.replace('::ffff:', '');
});
