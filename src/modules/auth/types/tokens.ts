export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type GenerateTokensResult = Tokens & {
  nonce: string;
};
