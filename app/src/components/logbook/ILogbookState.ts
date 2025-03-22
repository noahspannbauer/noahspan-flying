import { ColumnDef } from '@noahspan/noahspan-components';
import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { ILogbookEntry } from './ILogbookEntry';

export interface ILogbookState {
  alert: Alert | undefined;
  columns: ColumnDef<ILogbookEntry>[];
  entries: ILogbookEntry[];
  formMode: FormMode;
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isFormOpen: boolean;
  isLoading: boolean;
  isTracksOpen: boolean;
  selectedEntryId: string | undefined;
  tracksMode: FormMode;
}
