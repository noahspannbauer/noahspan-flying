export interface ILogbookEntryFormState {
  isDisabled: boolean;
  isLoading: boolean;
  pilotOptions: { label: string; value: string }[];
  selectedEntryPilotName: string;
}
