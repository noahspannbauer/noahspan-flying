import { Alert } from "../../interfaces/Alert.interface";

export interface LogFormState {
  alert: Alert | undefined;
  isDisabled: boolean;
  isLoading: boolean;
  pilotOptions: { key: string; label: string; }[];
  selectedPilotName: string;
}
