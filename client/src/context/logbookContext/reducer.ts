import { FormMode } from '../../enums/formMode';
import { Alert } from '../../interfaces/Alert.interface';
import { LogbookContextState } from './LogbookContextState.interface';

export type Action =
  | { type: 'SET_FORM_ALERT'; payload: Alert | undefined }
  | { type: 'SET_FORM_MODE'; payload: FormMode }
  | { type: 'SET_IS_DRAWER_OPEN'; payload: boolean }
  | { type: 'SET_IS_FORM_DISABLED'; payload: boolean }
  | { type: 'SET_IS_FORM_LOADING'; payload: boolean }
  | { type: 'SET_OPEN_CLOSE_DRAWER'; payload: { formMode: FormMode, isDrawerOpen: boolean, selectedLogId: string | undefined }}
  | { type: 'SET_SELECTED_LOG_ID'; payload: string }

export const reducer = (
  state: LogbookContextState,
  action: Action
): LogbookContextState => {
  switch (action.type) {
    case 'SET_FORM_ALERT': {
      return {
        ...state,
        formAlert: action.payload
      };
    }
    case 'SET_FORM_MODE': {
      return {
        ...state,
        formMode: action.payload
      }
    }
    case 'SET_IS_DRAWER_OPEN': {
      return {
        ...state,
        isDrawerOpen: action.payload
      };
    }
    case 'SET_IS_FORM_DISABLED': {
      return {
        ...state,
        isFormDisabled: action.payload
      }
    }
    case 'SET_IS_FORM_LOADING': {
      return {
        ...state,
        isFormLoading: action.payload
      }
    }
    case 'SET_OPEN_CLOSE_DRAWER': {
      return {
        ...state,
        formMode: action.payload.formMode,
        isDrawerOpen: action.payload.isDrawerOpen,
        selectedLogId: action.payload.selectedLogId
      }
    }
    case 'SET_SELECTED_LOG_ID': {
      return {
        ...state,
        selectedLogId: action.payload
      }
    }
    default: {
      return state;
    }
  }
};
