import { useEffect, useState } from "react";
import { useHttpClient } from "../httpClient/UseHttpClient";
import { useAccessToken } from "../accessToken/UseAcessToken";
import { useIsAuthenticated } from "@azure/msal-react";
import { AxiosInstance, AxiosResponse } from "axios";
import { ILogbookEntry } from "../../components/logbook/ILogbookEntry";

export const useLogs = () => {
  const [logs, setLogs] = useState<ILogbookEntry[]>();
  const httpClient: AxiosInstance = useHttpClient();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const getLogs = async () => {
      try {
        const config = isAuthenticated
          ? { headers: { Authorization: await getAccessToken() } }
          : {};
        const response: AxiosResponse = await httpClient.get(
          `api/logs`,
          config
        );
        const logs: ILogbookEntry[] = response.data;

        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setLogs(logs)
      } catch (error) {
        return error;
      }
    }

    getLogs();
  }, [])

  return {
    logs
  }
}