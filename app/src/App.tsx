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
      try {
        const response: AxiosResponse = await axios.get(
          `http://localhost:7071/api/featureFlags?key=flying*&label=${process.env.NODE_ENV}`
        );
        const featureFlags: unknown[] = response.data;

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
