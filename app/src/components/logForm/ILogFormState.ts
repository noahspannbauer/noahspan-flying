export interface ILogFormState {
  error: string | undefined;
  isDisabled: boolean;
  isLoading: boolean;
  pilotOptions: { label: string; value: string }[];
  selectedEntryPilotName: string;
}
