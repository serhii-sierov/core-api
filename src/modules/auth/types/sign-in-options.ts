import { IdentityProvider } from 'modules/user/types';

import { DeviceInfo } from '../types';

export type SignInOptionsBase = {
  deviceInfo?: DeviceInfo;
  requestRefreshToken?: string;
};

export type SignInOptions = SignInOptionsBase & {
  provider: IdentityProvider;
  forceNewSession?: boolean;
};
