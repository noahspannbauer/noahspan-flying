import { FormMode } from '../../enums/formMode';

export interface ILogFormProps {
  logId?: string;
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
}
