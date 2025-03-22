export interface LogTracksState {
  isConfirmDialogOpen: boolean;
  isConfirmDialogLoading: boolean;
  isLoading: boolean;
  selectedTrack: {
    fileName: string,
    index: number
  } | undefined;
  tracks: string[];
}