import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UAParser } from 'ua-parser-js';

import { GqlContext } from 'types';

export type HttpClientInfoType = {
  summary?: string | null;
  browser?: string;
  device?: string;
  os?: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- Naming convention enforced by NestJS
export const UserAgent = createParamDecorator<
  keyof HttpClientInfoType | Array<keyof HttpClientInfoType> | undefined,
  ExecutionContext
>((data, context): Partial<HttpClientInfoType> | HttpClientInfoType[keyof HttpClientInfoType] | HttpClientInfoType => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext<GqlContext>().req;

  const uaInfo = UAParser(req.headers);

  const browser = uaInfo.browser.name && `${uaInfo.browser.name} ${uaInfo.browser.version ?? ''}`;
  const device = uaInfo.device.vendor && `${uaInfo.device.vendor} ${uaInfo.device.model ?? ''}`;
  const os = uaInfo.os.name && `${uaInfo.os.name} ${uaInfo.os.version ?? ''}`;

  const summary = `${browser ?? ''} ${device || os ? 'on' : ''} ${device ?? ''} ${os ?? ''}`.trim() || null;

  const info: HttpClientInfoType = { browser, device, os, summary };

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
