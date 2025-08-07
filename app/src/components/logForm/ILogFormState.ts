import { Alert } from "../../interfaces/Alert.interface";

export interface ILogFormState {
  alert: Alert | undefined;
  isDisabled: boolean;
  isLoading: boolean;
  pilotOptions: { label: string; value: string }[];
  selectedPilotName: string;
}
