import { FormMode } from '../../enums/formMode';

export interface ILogFormProps {
  entryId?: string;
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
}
