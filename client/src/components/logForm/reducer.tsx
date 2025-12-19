import { Alert } from '../../interfaces/Alert.interface';
import { LogFormState } from './LogFormState.interface';

type Action =
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_EXPERIENCE_SELECTED_KEYS'; payload: Selection }
  | { type: 'SET_INSTRUMENT_SELECTED_KEYS'; payload: Selection }
  | { type: 'SET_IS_DISABLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_LANDINGS_SELECTED_KEYS'; payload: Selection }
  | { type: 'SET_PILOT_OPTIONS'; payload: { key: string, label: string; }[] }
  | { type: 'SET_SELECTED_PILOT_NAME'; payload: string };

export const initialState: LogFormState = {
  alert: undefined,
  experienceSelectedKeys: new Set([]),
  instrumentSelectedKeys: new Set([]),
  isDisabled: false,
  isLoading: true,
  landingsSelectedKeys: new Set(['1']),
  pilotOptions: [],
  selectedPilotName: ''
};

export const reducer = (
  state: LogFormState,
  action: Action
): LogFormState => {
  switch (action.type) {
    case 'SET_ALERT': {
      return {
        ...state,
        alert: action.payload
      };
    }
    case 'SET_EXPERIENCE_SELECTED_KEYS': {
      return {
        ...state,
        experienceSelectedKeys: action.payload
      }
    }
    case 'SET_IS_DISABLED': {
      return {
        ...state,
        isDisabled: action.payload
      };
    }
    case 'SET_INSTRUMENT_SELECTED_KEYS': {
      return {
        ...state,
        instrumentSelectedKeys: action.payload
      }
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }
    case 'SET_LANDINGS_SELECTED_KEYS': {
      return {
        ...state,
        landingsSelectedKeys: action.payload
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
