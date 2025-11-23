import { FormMode } from '../../enums/formMode';

export interface IPilotFormProps {
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
  pilotId?: string;
}
