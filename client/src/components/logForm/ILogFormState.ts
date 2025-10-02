import { Alert } from "../../interfaces/Alert.interface";

export interface ILogFormState {
  alert: Alert | undefined;
  experienceCollapseOpen: boolean;
  instrumentCollapseOpen: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  landingsCollapseOpen: boolean;
  pilotOptions: { label: string; value: string }[];
  selectedPilotName: string;
}
