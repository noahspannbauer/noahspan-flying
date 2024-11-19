import { ILogbookEntryFormState } from './ILogbookEntryFormState';

type Action =
  | { type: 'SET_IS_DISABLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_PILOT_OPTIONS'; payload: { label: string; value: string }[] }
  | { type: 'SET_SELECTED_ENTRY_PILOT_NAME'; payload: string };

export const initialState: ILogbookEntryFormState = {
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
  }
};
