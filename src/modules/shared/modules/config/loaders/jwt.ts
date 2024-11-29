export interface JwtEnvironmentVariables {
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRES: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRES: string;
}

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

export interface JwtConfigLoader {
  jwt: JwtConfig;
}

export const jwtConfigLoader = (): JwtConfigLoader => ({
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
