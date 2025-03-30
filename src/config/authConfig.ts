export const AUTH_CONFIG = {
  PROVIDERS: {
    GOOGLE: 'google',
    GITHUB: 'github'
  },
  OAUTH_ENDPOINTS: {
    AUTHORIZE: (provider: string) => `/api/v1/auth/oauth2/redirect/${provider}`,
    CALLBACK: (provider: string) => `/login/oauth2/code/${provider}`
  }
};