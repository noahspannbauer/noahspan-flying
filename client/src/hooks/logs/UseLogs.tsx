import { useEffect, useState } from "react";
import { useAuth } from 'react-oidc-context';
import { AxiosInstance, AxiosResponse } from "axios";
import { LogbookEntry } from "../../components/logbook/LogbookEntry.interface";
import httpClient from '../../httpClient/httpClient'

export const useLogs = () => {
  const [logs, setLogs] = useState<LogbookEntry[]>();
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const auth = useAuth()

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLogsLoading(true);

        const response: AxiosResponse = await httpClient.get(
          `api/logs`
        );
        const logs: LogbookEntry[] = response.data;

        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setLogs(logs)
      } catch (error) {
        return error;
      } finally {
        setLogsLoading(false);
      }
    }

    getLogs();
  }, [])

  return {
    logs,
    logsLoading
  }
}