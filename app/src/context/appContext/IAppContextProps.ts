import { Action } from './reducer';
import { IAppContextState } from './IAppContextState';

export interface IAppContextProps {
  state: IAppContextState;
  dispatch: React.Dispatch<Action>;
}
