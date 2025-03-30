export type AdditionalJwtPayload = {
  email?: string;
  sessionId?: string;
};

export type JwtPayload = {
  sub: string;
  jti?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
} & AdditionalJwtPayload;
