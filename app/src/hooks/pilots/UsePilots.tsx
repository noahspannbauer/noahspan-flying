import { useEffect, useState } from 'react';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAccessToken } from '../../hooks/accessToken/UseAcessToken';
import { useIsAuthenticated } from '@azure/msal-react';

export const usePilots = () => {
  const [pilots, setPilots] = useState<any[]>();
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();

  const getPilot = async (pilotId: string) => {
    try {
      const config = isAuthenticated
        ? { headers: { Authorization: await getAccessToken() } }
        : {};
      const response: AxiosResponse = await httpClient.get(
        `api/pilots/${pilotId}`
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const getPilots = async () => {
      try {
        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/pilots`,
          config
        );

        setPilots(response.data);
      } catch (error) {
        return error;
      }
    };

    getPilots();
  }, []);

  return {
    getPilot,
    pilots
  };
};
