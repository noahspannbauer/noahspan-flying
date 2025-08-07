import { Alert } from '../../interfaces/Alert.interface';
import { ILogFormState } from './ILogFormState';

type Action =
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_IS_DISABLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_PILOT_OPTIONS'; payload: { label: string; value: string }[] }
  | { type: 'SET_SELECTED_PILOT_NAME'; payload: string };

export const initialState: ILogFormState = {
  alert: undefined,
  isDisabled: false,
  isLoading: true,
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
