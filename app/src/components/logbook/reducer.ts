import { FormMode } from '../../enums/formMode';
import { ILogbookEntry } from './ILogbookEntry';
import { ILogbookState } from './ILogbookState';

type Action =
  | {
      type: 'SET_DELETE';
      payload: {
        isConfirmationDialogOpen: boolean;
        selectedEntryId: string | undefined;
      };
    }
  | { type: 'SET_ENTRIES'; payload: ILogbookEntry[] }
  | { type: 'SET_ERROR'; payload: string | undefined }
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
    };

export const initialState: ILogbookState = {
  entries: [],
  error: undefined,
  formMode: FormMode.CANCEL,
  isConfirmDialogLoading: false,
  isConfirmDialogOpen: false,
  isFormOpen: false,
  isLoading: false,
  selectedEntryId: undefined
};

export const reducer = (
  state: ILogbookState,
  action: Action
): ILogbookState => {
  switch (action.type) {
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
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload
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
    default: {
      return state;
    }
  }
};
