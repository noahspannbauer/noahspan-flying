import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Pilots from './components/pilots/Pilots';
import Logbook from './components/logbook/Logbook';
import { useAppContext } from './hooks/appContext/UseAppContext';
import { AxiosInstance, AxiosResponse } from 'axios';
import { useHttpClient } from './hooks/httpClient/UseHttpClient';
import { useFeatureFlag } from './hooks/featureFlag/UseFeatureFlag';
import SiteNav from './components/siteNav/SiteNav';
import { useMsal } from '@azure/msal-react';
import { Button } from '@noahspan/noahspan-components';

const App: React.FC<unknown> = () => {
  const httpClient: AxiosInstance = useHttpClient();
  const appContext = useAppContext();
    const { instance } = useMsal();

  const handleSignInRedirect = () => {
    instance
      .loginRedirect({
        scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/user_impersonation`]
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const getFeatureFlags = async () => {
      try {
        const featureFlags: { key: string; enabled: boolean }[] = []
        const response: AxiosResponse = await httpClient.get(
          'api/featureFlags'
        );
        
        for (const featureFlag of response.data) {
          featureFlags.push({
            key: featureFlag.rowKey,
            enabled: featureFlag.active === 'true' ? true : false
          })
        }

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

  return (
    <div>
      <Button onClick={handleSignInRedirect}>Sign On</Button>
      {/* <SiteNav /> */}
      <Routes>
        {useFeatureFlag('pilots')?.enabled && (
          <Route path="/pilots" element={<Pilots />} />
        )}
        <Route path="/" element={<Logbook />} />
      </Routes>
    </div>
  );
};

export default App;
