import { IFeatureFlagValue } from '../../hooks/featureFlag/IFeatureFlagValue';
import { IAppContextState } from './IAppContextState';

export type Action = {
  type: 'SET_FEATURE_FLAGS';
  payload: IFeatureFlagValue[];
};

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
    default: {
      return state;
    }
  }
};
