export type AdditionalJwtPayload = {
  email?: string;
  sessionId?: string;
  nonce?: string;
};

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
} & AdditionalJwtPayload;
