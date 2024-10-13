export type AdditionalJwtPayload = {
  email?: string;
  device?: string;
};

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
} & AdditionalJwtPayload;
