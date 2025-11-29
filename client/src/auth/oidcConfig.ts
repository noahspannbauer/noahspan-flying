import { createReactOidc } from "oidc-spa/react";

export const { OidcProvider, useOidc, getOidc } = createReactOidc(async () => ({
  issuerUri: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}/v2.0`,
  clientId: import.meta.env.VITE_CLIENT_ID,
  homeUrl: import.meta.env.VITE_BASE_URL,
  scopes: ['email', 'openid', 'profile', `api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`],
  autoLogin: false,
  postLoginRedirectUrl: '/',
  noIframe: true
}));