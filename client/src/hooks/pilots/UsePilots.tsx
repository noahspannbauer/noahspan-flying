import { useEffect, useState } from 'react';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from '../../hooks/httpClient/UseHttpClient';
import { useAuth } from 'react-oidc-context';

export const usePilots = () => {
  const [pilots, setPilots] = useState<any[]>();
  const httpClient: AxiosInstance = useHttpClient();
  const auth = useAuth();

  const getPilot = async (pilotId: string) => {
    try {
      const response: AxiosResponse = await httpClient.get(
        `api/pilots/${pilotId}`,
        {
          headers: {
            Authorization: auth.user?.access_token
          }
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const getPilots = async () => {
      try {
        const response: AxiosResponse = await httpClient.get(
          `api/pilots`,
          {
            headers: {
              Authorization: auth.user?.access_token
            }
          }
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
