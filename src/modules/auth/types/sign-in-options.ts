import { DeviceInfo } from '../types';

export type SignInOptionsBase = {
  deviceInfo?: DeviceInfo;
  requestRefreshToken?: string;
};

export type SignInOptions = SignInOptionsBase & {
  forceNewSession?: boolean;
};
