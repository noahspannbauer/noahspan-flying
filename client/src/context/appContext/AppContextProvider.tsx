import { useMemo, useReducer } from 'react';
import { AppContext } from './AppContext';
import { IAppContextProviderProps } from './IAppContextProviderProps';
import { IAppContextProps } from './IAppContextProps';
import { IAppContextState } from './IAppContextState';
import { reducer } from './reducer';

const AppContextProvider: React.FC<IAppContextProviderProps> = (
  props: IAppContextProviderProps
) => {
  const intialState: IAppContextState = {
    featureFlags: [],
    userProfile: {}
  };
  const [state, dispatch] = useReducer(reducer, intialState);
  const contextValue: IAppContextProps = useMemo(() => {
    return {
      state,
      dispatch
    };
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
