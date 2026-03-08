import { Alert } from "../../interfaces/Alert.interface";

export interface LogFormState {
  alert: Alert | undefined;
  isDisabled: boolean;
  isLoading: boolean;
  pilotOptions: { label: string; value: string;  }[];
  selectedPilotName: string;
}
