import { useContext } from 'react';
import { LogbookContext } from '../../context/logbookContext/LogbookContext';

export const useLogbookContext = () => {
  const { state, dispatch } = useContext(LogbookContext);

  return {
    state,
    dispatch
  };
};
