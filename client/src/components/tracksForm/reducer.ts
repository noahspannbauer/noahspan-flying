import { TracksFormState } from "./TracksFormState.interface";

type Action = 
  | { type: 'SET_IS_CONFIRM_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_IS_CONFORM_DIALOG_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_ON_DELETE_TRACK'; payload: { isConfirmDialogOpen: boolean, selectedTrack: { fileName: string, index: number } }}
  | { type: 'SET_TRACKS'; payload: { id: string; order: number; url: string }[] };

export const initialState: TracksFormState = {
  isConfirmDialogOpen: false,
  isConfirmDialogLoading: false,
  isLoading: false,
  selectedTrack: undefined,
  tracks: []
}

export const reducer = (state: TracksFormState, action: Action): TracksFormState => {
  switch (action.type) {
    case 'SET_IS_CONFIRM_DIALOG_OPEN': {
      return {
        ...state,
        isConfirmDialogOpen: action.payload
      }
    }
    case 'SET_IS_CONFORM_DIALOG_LOADING': {
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
    case 'SET_ON_DELETE_TRACK': {
      return {
        ...state,
        isConfirmDialogOpen: action.payload.isConfirmDialogOpen,
        selectedTrack: action.payload.selectedTrack
      }
    }
    case 'SET_TRACKS': {
      return {
        ...state,
        tracks: action.payload
      }
    }
    default: {
      return state
    }
  }
}
