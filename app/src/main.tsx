import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@noahspan/noahspan-components/noahspan-components.css';
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './auth/msalConfig.ts';

const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig);
const accounts = msalInstance.getAllAccounts();

console.log({ accounts, msalInstance });

if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <App pca={msalInstance} />
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>
);