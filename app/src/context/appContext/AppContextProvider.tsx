import { IAppContextProviderProps } from './IAppContextProviderProps';
import { IAppContextState } from './IAppContextState';

const AppContextProvider: React.FC<IAppContextProviderProps> = (
  props: IAppContextProviderProps
) => {
  const intialState: IAppContextState = {
    featureFlags: []
  };
  const [state, dispatch] = useReducer(reducer, intialState);
  const contextValue = (IAppContextProps = useMemo(() => {
    return (
      {
        state,
        dispatch
      },
      [state, dispatch]
    );
  }));

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
