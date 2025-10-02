import { Alert } from '../../interfaces/Alert.interface';
import { ILogFormState } from './ILogFormState';

type Action =
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_EXPERIENCE_COLLAPSE_OPEN'; payload: boolean }
  | { type: 'SET_INSTRUMENT_COLLAPSE_OPEN'; payload: boolean }
  | { type: 'SET_IS_DISABLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_LANDINGS_COLLAPSE_OPEN'; payload: boolean }
  | { type: 'SET_PILOT_OPTIONS'; payload: { label: string; value: string }[] }
  | { type: 'SET_SELECTED_PILOT_NAME'; payload: string };

export const initialState: ILogFormState = {
  alert: undefined,
  experienceCollapseOpen: true,
  instrumentCollapseOpen: false,
  isDisabled: false,
  isLoading: true,
  landingsCollapseOpen: true,
  pilotOptions: [],
  selectedPilotName: ''
};

export const reducer = (
  state: ILogFormState,
  action: Action
): ILogFormState => {
  switch (action.type) {
    case 'SET_ALERT': {
      return {
        ...state,
        alert: action.payload
      };
    }
    case 'SET_EXPERIENCE_COLLAPSE_OPEN': {
      return {
        ...state,
        experienceCollapseOpen: action.payload
      }
    }
    case 'SET_IS_DISABLED': {
      return {
        ...state,
        isDisabled: action.payload
      };
    }
    case 'SET_INSTRUMENT_COLLAPSE_OPEN': {
      return {
        ...state,
        instrumentCollapseOpen: action.payload
      }
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case 'SET_LANDINGS_COLLAPSE_OPEN': {
      return {
        ...state,
        landingsCollapseOpen: action.payload
      }
    }
    case 'SET_PILOT_OPTIONS': {
      return {
        ...state,
        pilotOptions: action.payload
      };
    }
    case 'SET_SELECTED_PILOT_NAME': {
      return {
        ...state,
        selectedPilotName: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
