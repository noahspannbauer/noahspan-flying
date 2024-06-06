import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';

export const useHttpClient = () => {
  let config: CreateAxiosDefaults<any>;

  if (import.meta.env.DEV) {
    config = {
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } else {
    config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  const httpClient: AxiosInstance = axios.create(config);

  return httpClient;
};
