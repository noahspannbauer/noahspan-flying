import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@noahspan/noahspan-components/noahspan-components.css';
import { EventMessage, EventPayload, EventType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { useAuthProvider } from './hooks/auth/UseAuthProvider.tsx';

const { AuthProvider } = useAuthProvider();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </AuthProvider>
  </React.StrictMode>
);

