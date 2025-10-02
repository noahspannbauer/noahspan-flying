import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { getOidc } from '../auth/oidcConfig';

let config: CreateAxiosDefaults<any> = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

const httpClient: AxiosInstance = axios.create(config)

httpClient.interceptors.request.use(async (config) => {
  const oidc = await getOidc();
  console.log('blah')
  if (oidc.isUserLoggedIn) {
    const { accessToken } = await oidc.getTokens();
    console.log(accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default httpClient;