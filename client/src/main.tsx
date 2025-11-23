import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import LogbookContextProvider from './context/logbookContext/LogbookContextProvider.tsx'
import { BrowserRouter } from 'react-router-dom';
import { OidcProvider } from './auth/oidcConfig.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <OidcProvider>
    <AppContextProvider>
      <LogbookContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LogbookContextProvider>
    </AppContextProvider>
  </OidcProvider>
);
