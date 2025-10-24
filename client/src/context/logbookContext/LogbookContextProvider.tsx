import { useMemo, useReducer } from 'react';
import { LogbookContext } from './LogbookContext';
import { LogbookContextProviderProps } from './LogbookContextProviderProps.interface';
import { LogbookContextProps } from './LogbookContextProps.interface';
import { LogbookContextState } from './LogbookContextState.interface';
import { reducer } from './reducer';
import { FormMode } from '../../enums/formMode';

const AppContextProvider: React.FC<LogbookContextProviderProps> = (
  props: LogbookContextProviderProps
) => {
  const initialState: LogbookContextState = {
    formAlert: undefined,
    formMode: FormMode.VIEW,
    isDrawerOpen: false,
    isFormDisabled: false,
    isFormLoading: false,
    selectedLogId: ''
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue: LogbookContextProps = useMemo(() => {
    return {
      state,
      dispatch
    };
  }, [state, dispatch]);

  return (
    <LogbookContext.Provider value={contextValue}>
      {props.children}
    </LogbookContext.Provider>
  );
};

export default AppContextProvider;
