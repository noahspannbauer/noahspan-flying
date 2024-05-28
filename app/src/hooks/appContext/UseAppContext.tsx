import { useContext } from 'react';
import { AppContext } from '../../context/appContext/AppContext';

export const useAppContext = () => {
  const { state, dispatch } = useContext(AppContext);

  return {
    state,
    dispatch
  };
};
