import { FormMode } from '../../enums/formMode';

export interface ILogbookEntryFormProps {
  entryId?: string;
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
}
