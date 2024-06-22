import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@noahspan/noahspan-components/noahspan-components.css';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const pca: PublicClientApplication = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URL
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </MsalProvider>
  </React.StrictMode>
);
