import { ColumnDef } from '@noahspan/noahspan-components';
import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { LogbookEntry } from './LogbookEntry.interface';

export interface LogbookState {
  alert: Alert | undefined;
  columns: ColumnDef<LogbookEntry>[];
  entries: LogbookEntry[];
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isLoading: boolean;
}
