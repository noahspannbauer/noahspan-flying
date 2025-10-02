import { useEffect, useState } from "react";
import { useHttpClient } from "../httpClient/UseHttpClient";
import { useAuth } from 'react-oidc-context';
import { AxiosInstance, AxiosResponse } from "axios";
import { ILogbookEntry } from "../../components/logbook/ILogbookEntry";

export const useLogs = () => {
  const [logs, setLogs] = useState<ILogbookEntry[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const httpClient: AxiosInstance = useHttpClient();
  const auth = useAuth()

  useEffect(() => {
    const getLogs = async () => {
      try {
        setIsLoading(true);

        const response: AxiosResponse = await httpClient.get(
          `api/logs`,
          {
            headers: {
              Authorization: auth.user?.access_token
            }
          }
        );
        const logs: ILogbookEntry[] = response.data;

        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setLogs(logs)
      } catch (error) {
        return error;
      } finally {
        setIsLoading(false);
      }
    }

    getLogs();
  }, [])

  return {
    logs,
    isLoading
  }
}