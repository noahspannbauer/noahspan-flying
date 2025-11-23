import { Alert } from "../../interfaces/Alert.interface";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";

export interface FlightsState {
  alert: Alert | undefined;
  flights: LogbookEntry[];
  isLoading: boolean;
}