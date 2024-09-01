import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Pilots from './components/pilots/Pilots';
import { useAppContext } from './hooks/appContext/UseAppContext';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from './hooks/httpClient/UseHttpClient';
import { useFeatureFlag } from './hooks/featureFlag/UseFeatureFlag';
import { useMsal } from '@azure/msal-react';
import SiteNav from './components/siteNav/SiteNav';
import { EventMessage, EventPayload, EventType } from '@azure/msal-browser';
import { User } from '@microsoft/microsoft-graph-types';

type EventPayloadExtended = EventPayload & { accessToken: string };

const App: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
  const { inProgress, instance } = useMsal();
  const handleSignIn = async () => {
    await instance.loginRedirect({
      scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`]
    });
  };
  const handleSignOut = () => {
    instance.logoutRedirect();
  };

  useEffect(() => {
    const getFeatureFlags = async () => {
      try {
        const featureFlagKeys: string = 'flying-pilots';
        const response: AxiosResponse = await httpClient.get(
          `api/featureFlags?keys=${featureFlagKeys}&label=${import.meta.env.MODE}`
        );
        const featureFlags: { key: string; enabled: boolean }[] = response.data;

        if (featureFlags.length > 0) {
          appContext.dispatch({
            type: 'SET_FEATURE_FLAGS',
            payload: featureFlags
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getFeatureFlags();
  }, []);

  useEffect(() => {
    const callback = instance.addEventCallback(
      async (message: EventMessage) => {
        if (message.eventType === EventType.LOGIN_SUCCESS) {
          try {
            const eventPayload: EventPayloadExtended =
              message.payload as EventPayloadExtended;
            const response: AxiosResponse = await httpClient.get(
              `api/userProfile`,
              {
                headers: {
                  Authorization: `Bearer ${eventPayload.accessToken}`
                }
              }
            );
            const userProfile: User = response.data;

            appContext.dispatch({
              type: 'SET_USER_PROFILE',
              payload: userProfile
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    );

    return () => {
      if (callback) {
        instance.removeEventCallback(callback);
        appContext.dispatch({ type: 'SET_USER_PROFILE', payload: {} });
      }
    };
  }, []);

  return (
    <div className="container mx-auto">
      <SiteNav
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        inProgress={inProgress}
      />
      <Routes>
        {useFeatureFlag('flying-pilots')?.enabled && (
          <Route path="/" element={<Pilots />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
