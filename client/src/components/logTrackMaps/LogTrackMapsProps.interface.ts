export interface LogTrackMapsProps {
  logId: string;
  tracks: {id: string; order: number; url: string}[];
}