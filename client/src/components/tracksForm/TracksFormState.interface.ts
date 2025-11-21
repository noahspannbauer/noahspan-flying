export interface TracksFormState {
  isConfirmDialogOpen: boolean;
  isConfirmDialogLoading: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  selectedTrack: {
    id: string,
    filename: string,
    index: number
  } | undefined;
  tracks: { id: string; order: number; url: string; }[];
}