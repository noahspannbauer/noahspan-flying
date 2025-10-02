import { createReactOidc } from "oidc-spa/react";

export const { OidcProvider, useOidc, getOidc, withLoginEnforced, enforceLogin } = createReactOidc(async () => ({
  issuerUri: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}/v2.0`,
  clientId: import.meta.env.VITE_CLIENT_APP_ID,
  homeUrl: import.meta.env.BASE_URL,
  scopes: ['email', 'openid', 'profile', `api://${import.meta.env.VITE_API_APP_ID}/user_impersonation`]
}));