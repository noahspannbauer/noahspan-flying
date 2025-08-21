export interface ILogbookEntry {
  id: string;
  pilot: string;
  date: string;
  aircraftMakeModel: string;
  aircraftIdentity: string;
  routeFrom: string;
  routeTo: string;
  durationOfFlight: number | null;
  singleEngineLand: number | null;
  simulatorAtd: number | null;
  landingsDay: number | null;
  landingsNight: number | null;
  instrumentActual: number | null;
  instrumentSimulated: number | null;
  instrumentApproaches: number | null;
  instrumentHolds: number | null;
  instrumentNavTrack: number | null;
  groundTrainingReceived: number;
  flightTrainingReceived: number;
  crossCountry: number | null;
  night: number | null;
  solo: number | null;
  pilotInCommand: number | null;
  tracks: {id: string; order: number; url: string}[];
  notes: string;
}
