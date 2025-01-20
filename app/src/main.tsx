import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/appContext/AppContextProvider.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@noahspan/noahspan-components/noahspan-components.css';
import { LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_TENANT_ID,
    },
    // cache: {
    //     cacheLocation: "sessionStorage", // This configures where your cache will be stored
    //     storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    // },
    // system: {	
    //     loggerOptions: {	
    //         loggerCallback: (level: any, message: any, containsPii: any) => {	
    //             if (containsPii) {		
    //                 return;		
    //             }		
    //             switch (level) {
    //                 case LogLevel.Error:
    //                     console.error(message);
    //                     return;
    //                 case LogLevel.Info:
    //                     console.info(message);
    //                     return;
    //                 case LogLevel.Verbose:
    //                     console.debug(message);
    //                     return;
    //                 case LogLevel.Warning:
    //                     console.warn(message);
    //                     return;
    //                 default:
    //                     return;
    //             }	
    //         }	
    //     }	
    // }
};

const msalInstance = new PublicClientApplication(msalConfig)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </MsalProvider>
  </React.StrictMode>
);

