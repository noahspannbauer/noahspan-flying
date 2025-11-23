import { Action } from './reducer';
import { LogbookContextState } from './LogbookContextState.interface';

export interface LogbookContextProps {
  state: LogbookContextState;
  dispatch: React.Dispatch<Action>;
}
