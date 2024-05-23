import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import { NextUIProvider } from '@nextui-org/react';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const configuration: Configuration = {
  auth: {
    clientId: 'd3562a45-050d-4f9a-baed-0497c7156924',
    authority:
      'https://login.microsoftonline.com/0f23652e-4b15-420f-991e-3d6fc769a31d',
    redirectUri: 'http://localhost:5173'
  }
};

const pca = new PublicClientApplication(configuration);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <NextUIProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NextUIProvider>
    </MsalProvider>
  </React.StrictMode>
);