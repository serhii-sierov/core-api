import { IdentityProvider } from 'modules/user/types';

export type AdditionalJwtPayload = {
  email?: string;
  sessionId?: string;
  provider?: IdentityProvider;
  picture?: string;
  name?: string;
};

export type JwtPayload = {
  sub: string;
  jti?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
} & AdditionalJwtPayload;
