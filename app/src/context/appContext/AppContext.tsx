import { Context, createContext } from 'react';
import { IAppContextProps } from './IAppContextProps';

export const AppContext: Context<IAppContextProps> =
  createContext<IAppContextProps>({} as IAppContextProps);
