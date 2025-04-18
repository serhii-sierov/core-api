import { IdentityEntity } from 'modules/user/entities';

import { DeviceInfo } from './device-info';

export type SignInOptionsBase = {
  deviceInfo?: DeviceInfo;
  requestRefreshToken?: string;
};

export type SignInOptions = SignInOptionsBase & {
  identity: IdentityEntity;
  forceNewSession?: boolean;
};

export type HandleSessionOptions = {
  deviceInfo?: DeviceInfo;
  identity: IdentityEntity;
  sessionId?: string;
  isExistingSession?: boolean;
};
