import { ColumnDef } from '@noahspan/noahspan-components';
import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { ILogbookEntry } from './ILogbookEntry';
import { ILogbookState } from './ILogbookState';

type Action =
  | { type: 'SET_COLUMNS'; payload: ColumnDef<ILogbookEntry>[] }
  | {
      type: 'SET_DELETE';
      payload: {
        isConfirmationDialogOpen: boolean;
        selectedEntryId: string | undefined;
      };
    }
  | { type: 'SET_ENTRIES'; payload: ILogbookEntry[] }
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_FORM_MODE'; payload: FormMode }
  | { type: 'SET_IS_CONFIRMATION_DIALOG_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | {
      type: 'SET_OPEN_CLOSE_ENTRY_FORM';
      payload: {
        formMode: FormMode;
        selectedEntryId: string | undefined;
        isFormOpen: boolean;
      };
    }
  | { type: 'SET_OPEN_CLOSE_TRACKS'; payload: { tracksMode: FormMode, selectedRowKey: string | undefined, isTracksOpen: boolean; }};

export const initialState: ILogbookState = {
  alert: undefined,
  columns: [],
  entries: [],
  formMode: FormMode.CANCEL,
  isConfirmDialogLoading: false,
  isConfirmDialogOpen: false,
  isFormOpen: false,
  isLoading: false,
  isTracksOpen: false,
  selectedEntryId: undefined,
  tracksMode: FormMode.CANCEL
};

export const reducer = (
  state: ILogbookState,
  action: Action
): ILogbookState => {
  switch (action.type) {
    case 'SET_COLUMNS': {
      return {
        ...state,
        columns: action.payload
      }
    }
    case 'SET_DELETE': {
      return {
        ...state,
        isConfirmDialogOpen: action.payload.isConfirmationDialogOpen,
        selectedEntryId: action.payload.selectedEntryId
      };
    }
    case 'SET_ENTRIES': {
      return {
        ...state,
        entries: action.payload
      };
    }
    case 'SET_ALERT': {
      return {
        ...state,
        alert: action.payload
      };
    }
    case 'SET_FORM_MODE': {
      return {
        ...state,
        formMode: action.payload
      };
    }
    case 'SET_IS_CONFIRMATION_DIALOG_LOADING': {
      return {
        ...state,
        isConfirmDialogLoading: action.payload
      };
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case 'SET_OPEN_CLOSE_ENTRY_FORM': {
      return {
        ...state,
        formMode: action.payload.formMode,
        isFormOpen: action.payload.isFormOpen,
        selectedEntryId: action.payload.selectedEntryId
      };
    }
    case 'SET_OPEN_CLOSE_TRACKS': {
      return {
        ...state,
        tracksMode: action.payload.tracksMode,
        isTracksOpen: action.payload.isTracksOpen,
        selectedEntryId: action.payload.selectedRowKey
      }
    }
    default: {
      return state;
    }
  }
};
