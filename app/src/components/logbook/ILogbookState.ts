import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { ILogbookEntry } from './ILogbookEntry';

export interface ILogbookState {
  alert: Alert | undefined;
  entries: ILogbookEntry[];
  formMode: FormMode;
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isFormOpen: boolean;
  isLoading: boolean;
  selectedEntryId: string | undefined;
}
