import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UAParser } from 'ua-parser-js';

import { GqlContext } from 'types';

export type HttpClientInfoType = {
  summary: string;
  ipAddress?: string;
  browser?: string;
  device?: string;
  os?: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- Naming convention enforced by NestJS
export const HttpClientInfo = createParamDecorator<
  keyof HttpClientInfoType | Array<keyof HttpClientInfoType> | undefined,
  ExecutionContext
>((data, context): Partial<HttpClientInfoType> | HttpClientInfoType[keyof HttpClientInfoType] | HttpClientInfoType => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext<GqlContext>().req;

  // Temporary replacing '::ffff:' with an empty string to make the output more readable.
  // It is important to start addressing IP addresses using the IPv6 namespace and therefore include
  // the ::ffff: in your code because in the future there will be real hexadecimal data between those colons.
  // If you strip it off for aesthetic reasons, your code will break when it switches to an IPv6 network
  // or it's confronted with an IPv6 address.
  // https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
  const ipAddress = req.clientIp?.replace('::ffff:', '');

  const uaInfo = UAParser(req.headers);

  const browser = uaInfo.browser.name && `${uaInfo.browser.name} ${uaInfo.browser.version ?? ''}`;
  const device = uaInfo.device.vendor && `${uaInfo.device.vendor} ${uaInfo.device.model ?? ''}`;
  const os = uaInfo.os.name && `${uaInfo.os.name} ${uaInfo.os.version ?? ''}`;

  const deviceSummary = `${browser ?? ''} ${device || os ? 'on' : ''} ${device ?? ''} ${os ?? ''}`.trim();
  const summary = `${ipAddress} ${deviceSummary ? 'using' : ''} ${deviceSummary}`;

  const info: HttpClientInfoType = { ipAddress, browser, device, os, summary };

  if (Array.isArray(data)) {
    return data.reduce((result, key) => {
      if (key in info) {
        result[key] = info[key];
      }

      return result;
    }, {});
  } else if (data) {
    return info[data];
  }

  return info;
});
