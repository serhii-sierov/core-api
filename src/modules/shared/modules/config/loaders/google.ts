export interface GoogleEnvironmentVariables {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
};

export interface GoogleConfigLoader {
  google: GoogleConfig;
}

export const googleConfigLoader = (): GoogleConfigLoader => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL ?? '',
  },
});
