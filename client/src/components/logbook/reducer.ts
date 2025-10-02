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
        selectedLogId: string | undefined;
      };
    }
  | { type: 'SET_ENTRIES'; payload: ILogbookEntry[] }
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_FORM_MODE'; payload: FormMode }
  | { type: 'SET_IS_CONFIRMATION_DIALOG_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | {
      type: 'SET_OPEN_CLOSE_LOG_FORM';
      payload: {
        formMode: FormMode;
        selectedLogId: string | undefined;
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
  selectedLogId: undefined,
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
        selectedLogId: action.payload.selectedLogId
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
    case 'SET_OPEN_CLOSE_LOG_FORM': {
      return {
        ...state,
        formMode: action.payload.formMode,
        isFormOpen: action.payload.isFormOpen,
        selectedLogId: action.payload.selectedLogId
      };
    }
    case 'SET_OPEN_CLOSE_TRACKS': {
      return {
        ...state,
        tracksMode: action.payload.tracksMode,
        isTracksOpen: action.payload.isTracksOpen,
        selectedLogId: action.payload.selectedRowKey
      }
    }
    default: {
      return state;
    }
  }
};
