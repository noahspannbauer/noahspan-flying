import { useEffect, useState } from 'react';
import { AxiosInstance, AxiosResponse } from 'axios';
import httpClient from '../../httpClient/httpClient';

export const usePilots = () => {
  const [pilots, setPilots] = useState<any[]>();

  const getPilot = async (pilotId: string) => {
    try {
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
        const response: AxiosResponse = await httpClient.get(
          `/api/pilots`
        );
        console.log(response)
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
