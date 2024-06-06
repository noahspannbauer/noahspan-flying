import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Pilots from './components/pilots/Pilots';
import { useAppContext } from './hooks/appContext/UseAppContext';
import axios, { AxiosResponse } from 'axios';
import { useFeatureFlag } from './hooks/featureFlag/UseFeatureFlag';

const App: React.FC<unknown> = () => {
  const appContext = useAppContext();

  useEffect(() => {
    const getFeatureFlags = async () => {
      console.log(
        `${import.meta.env.VITE_API_URL}/api/featureFlags?keys=flying-pilots&label=${import.meta.env.MODE}`
      );
      try {
        const featureFlagKeys: string = 'flying-pilots';
        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/featureFlags?keys=${featureFlagKeys}&label=${import.meta.env.MODE}`
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

  return (
    <Routes>
      {useFeatureFlag('flying-pilots')?.enabled && (
        <Route path="/" element={<Pilots />} />
      )}
    </Routes>
  );
};

export default App;
