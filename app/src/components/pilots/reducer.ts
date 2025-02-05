import { FormMode } from "../../enums/formMode";
import { Pilot } from "./Pilot.interface";
import { PilotsState } from './PilotsState.interface'

type Action = 
  | {
    type: 'SET_DELETE';
    payload: {
      isConfirmDialogOpen: boolean;
      selectedPilotId: string | undefined;
    }
  }
  | { type: 'SET_PILOTS'; payload: Pilot[] }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_FORM_MODE'; payload: FormMode }
  | { type: 'SET_IS_CONFIRMATION_DIALOG_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | {
    type: 'SET_OPEN_CLOSE_ENTRY_FORM';
    payload: {
      formMode: FormMode;
      selectedPilotId: string | undefined;
      isFormOpen: boolean;
    }
  }

export const initialState: PilotsState = {
  pilots: [],
  error: undefined,
  formMode: FormMode.CANCEL,
  isConfirmDialogLoading: false,
  isConfirmDialogOpen: false,
  isFormOpen: false,
  isLoading: false,
  selectedPilotId: undefined
}

export const reducer = (
  state: PilotsState,
  action: Action
): PilotsState => {
  switch (action.type) {
    case 'SET_DELETE': {
      return {
        ...state,
        isConfirmDialogOpen: action.payload.isConfirmDialogOpen,
        selectedPilotId: action.payload.selectedPilotId
      }
    }
    case 'SET_PILOTS': {
      return {
        ...state,
        pilots: action.payload
      }
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload
      }
    }
    case 'SET_FORM_MODE': {
      return {
        ...state,
        formMode: action.payload
      }
    }
    case 'SET_IS_CONFIRMATION_DIALOG_LOADING': {
      return {
        ...state,
        isConfirmDialogLoading: action.payload
      }
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    case 'SET_OPEN_CLOSE_ENTRY_FORM': {
      return {
        ...state,
        formMode: action.payload.formMode,
        isFormOpen: action.payload.isFormOpen,
        selectedPilotId: action.payload.selectedPilotId
      }
    }
    default: {
      return state;
    }
  }
}
