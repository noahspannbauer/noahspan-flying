import { Alert } from "../../interfaces/Alert.interface";

export interface LogFormState {
  alert: Alert | undefined;
  experienceSelectedKeys: Selection;
  instrumentSelectedKeys: Selection;
  isDisabled: boolean;
  isLoading: boolean;
  landingsSelectedKeys: Selection;
  pilotOptions: { key: string; label: string; }[];
  selectedPilotName: string;
}
