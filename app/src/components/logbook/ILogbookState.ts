import { FormMode } from '../../enums/formMode';
import { ILogbookEntry } from './ILogbookEntry';

export interface ILogbookState {
  entries: ILogbookEntry[];
  formMode: FormMode;
  error: string | undefined;
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isFormOpen: boolean;
  isLoading: boolean;
  selectedEntryId: string | undefined;
}
