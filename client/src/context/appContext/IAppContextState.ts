import { User } from '@microsoft/microsoft-graph-types';

export interface IAppContextState {
  featureFlags: { key: string; enabled: boolean }[];
  userProfile: User;
}
