import { IFeatureFlagValue } from '../../hooks/featureFlag/IFeatureFlagValue';

export interface IAppContextState {
  featureFlags: IFeatureFlagValue[];
}
