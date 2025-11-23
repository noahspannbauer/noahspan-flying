import { Alert } from "../../interfaces/Alert.interface";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import { FlightsState } from "./FlightsState.interface";


type Action = 
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_FLIGHTS'; payload: LogbookEntry[] }
  | { type: 'SET_IS_LOADING'; payload: boolean }

export const initialState: FlightsState = {
  alert: undefined,
  flights: [],
  isLoading: true
}

export const reducer = (
  state: FlightsState,
  action: Action
): FlightsState => {
  switch (action.type) {
    case 'SET_ALERT': {
      return {
        ...state,
        alert: action.payload
      }
    }
    case 'SET_FLIGHTS': {
      return {
        ...state,
        flights: action.payload
      }
    }
    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    default: {
      return state
    }
  }
}