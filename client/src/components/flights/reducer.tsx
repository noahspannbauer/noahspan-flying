import { Alert } from "../../interfaces/Alert.interface";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";
import { FlightsState } from "./FlightsState.interface";


type Action = 
  | { type: 'SET_ALERT'; payload: Alert | undefined }
  | { type: 'SET_FLIGHTS'; payload: { flights: LogbookEntry[], hasMoreFlights: boolean, pageIndex: number, totalFlights: number } }
  | { type: 'SET_IS_LOADING'; payload: boolean }

export const initialState: FlightsState = {
  alert: undefined,
  flights: [],
  isLoading: true,
  hasMoreFlights: true,
  pageIndex: 0,
  pageSize: 5,
  totalFlights: 0
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
        flights: action.payload.flights,
        hasMoreFlights: action.payload.hasMoreFlights,
        pageIndex: action.payload.pageIndex,
        totalFlights: action.payload.totalFlights
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