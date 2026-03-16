import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { LogbookEntry } from './LogbookEntry.interface';
import { LogbookState } from './LogbookState.interface';

type Action =
  | { type: 'SET_COLUMNS'; payload: ColumnDef<LogbookEntry>[] }
  | { type: 'SET_IS_CONFIRMATION_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_ENTRIES'; payload: { entries: LogbookEntry[], totalEntries: number } }
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_IS_CONFIRMATION_DIALOG_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_PAGES'; payload: number[] }
  | { type: 'SET_PAGINATION'; payload: PaginationState };

export const initialState: LogbookState = {
  alert: undefined,
  columns: [],
  entries: [],
  isConfirmDialogLoading: false,
  isConfirmDialogOpen: false,
  isLoading: false,
  pages: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10
  },
  totalEntries: 0
};

export const reducer = (
  state: LogbookState,
  action: Action
): LogbookState => {
  switch (action.type) {
    case 'SET_COLUMNS': {
      return {
        ...state,
        columns: action.payload
      }
    }
    case 'SET_IS_CONFIRMATION_DIALOG_OPEN': {
      return {
        ...state,
        isConfirmDialogOpen: action.payload,
      };
    }
    case 'SET_ENTRIES': {
      return {
        ...state,
        entries: action.payload.entries,
        totalEntries: action.payload.totalEntries
      };
    }
    case 'SET_ALERT': {
      return {
        ...state,
        alert: action.payload
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
    case 'SET_PAGES': {
      return {
        ...state,
        pages: action.payload
      }
    }
    case 'SET_PAGINATION': {
      return {
        ...state,
        pagination: action.payload
      }
    }
    default: {
      return state;
    }
  }
};
