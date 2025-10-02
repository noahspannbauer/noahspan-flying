import { User } from '@microsoft/microsoft-graph-types';
import { IAppContextState } from './IAppContextState';

export type Action =
  | { type: 'SET_FEATURE_FLAGS'; payload: { key: string; enabled: boolean }[] }
  | { type: 'SET_USER_PROFILE'; payload: User };

export const reducer = (
  state: IAppContextState,
  action: Action
): IAppContextState => {
  switch (action.type) {
    case 'SET_FEATURE_FLAGS': {
      return {
        ...state,
        featureFlags: action.payload
      };
    }
    case 'SET_USER_PROFILE': {
      return {
        ...state,
        userProfile: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
