import {
  AuthenticationResult,
  InteractionRequiredAuthError
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

export const useAccessToken = () => {
  const { accounts, instance } = useMsal();
  const getAccessToken = async () => {
    const tokenRequest = {
      account: accounts[0],
      scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`]
    };

    try {
      const response: AuthenticationResult =
        await instance.acquireTokenSilent(tokenRequest);
      console.log(response.accessToken);
      return `Bearer ${response.accessToken}`;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(tokenRequest);
      }

      throw error;
    }
  };

  return {
    getAccessToken
  };
};
