import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { OidcProvider } from './auth/oidcConfig.ts';
// import { AuthProvider as OidcProvider } from 'react-oidc-context';
// import { oidcConfig } from './auth/oidcConfig.ts';


// const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig);

// msalInstance.initialize().then(() => {
//   const accounts = msalInstance.getAllAccounts();

//   if (accounts.length > 0) {
//     msalInstance.setActiveAccount(accounts[0]);
//   }

//   msalInstance.addEventCallback((event: EventMessage) => {
//     if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
//       const payload = event.payload as AuthenticationResult;
//       const account = payload.account;
//       msalInstance.setActiveAccount(account);
//     }
//   });

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <OidcProvider>
        <AppContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppContextProvider>
      </OidcProvider>
    </React.StrictMode>
  );
// })