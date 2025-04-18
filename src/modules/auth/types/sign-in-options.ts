import { IdentityEntity } from 'modules/user/entities';

import { DeviceInfo } from '../types';

export type SignInOptionsBase = {
  deviceInfo?: DeviceInfo;
  requestRefreshToken?: string;
};

export type SignInOptions = SignInOptionsBase & {
  identity: IdentityEntity;
  forceNewSession?: boolean;
};
