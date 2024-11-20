import { ILogbookEntryFormState } from './ILogbookEntryFormState';

type Action =
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_IS_DISABLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_PILOT_OPTIONS'; payload: { label: string; value: string }[] }
  | { type: 'SET_SELECTED_ENTRY_PILOT_NAME'; payload: string };

export const initialState: ILogbookEntryFormState = {
  error: undefined,
  isDisabled: false,
  isLoading: true,
  pilotOptions: [],
  selectedEntryPilotName: ''
};

export const reducer = (
  state: ILogbookEntryFormState,
  action: Action
): ILogbookEntryFormState => {
  switch (action.type) {
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload
      };
    }
    case 'SET_IS_DISABLED': {
      return {
        ...state,
        isDisabled: action.payload
      };
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case 'SET_PILOT_OPTIONS': {
      return {
        ...state,
        pilotOptions: action.payload
      };
    }
    case 'SET_SELECTED_ENTRY_PILOT_NAME': {
      return {
        ...state,
        selectedEntryPilotName: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
