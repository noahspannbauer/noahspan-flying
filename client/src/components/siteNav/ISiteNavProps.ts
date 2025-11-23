import { InteractionStatus } from '@azure/msal-browser';

export interface ISiteNavProps {
  handleSignIn: () => void;
  handleSignOut: () => void;
  inProgress: InteractionStatus;
}
