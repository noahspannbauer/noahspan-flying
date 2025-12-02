import { createReactOidc } from "oidc-spa/react";

export const { OidcProvider, useOidc, getOidc } = createReactOidc(async () => ({
  issuerUri: import.meta.env.VITE_ISSUER_URI,
  clientId: import.meta.env.VITE_CLIENT_ID,
  homeUrl: import.meta.env.VITE_BASE_URL,
  autoLogin: false,
  postLoginRedirectUrl: '/',
  noIframe: true,
  extraQueryParams: {
    audience: "api://flying-test-api"
  }
}));