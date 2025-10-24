import { Context, createContext } from 'react';
import { LogbookContextProps } from './LogbookContextProps.interface';

export const LogbookContext: Context<LogbookContextProps> =
  createContext<LogbookContextProps>({} as LogbookContextProps);
