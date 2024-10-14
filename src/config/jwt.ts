export type JwtConfig = {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
};

export const jwtConfig = (): { jwt: JwtConfig } => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'access_secret',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES ?? '15m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'refresh_secret',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES ?? '30d',
    },
  },
});
