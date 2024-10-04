import { PilotFormMode } from './PilotForm';

export interface IPilotFormProps {
  isDrawerOpen: boolean;
  mode: PilotFormMode;
  onOpenClose: (mode: PilotFormMode) => void;
  pilotId?: string;
}
