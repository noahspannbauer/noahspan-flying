import { ColumnDef } from "@noahspan/noahspan-components";

export interface ILogbookEntry {
  partitionKey: string;
  rowKey: string;
  id: string;
  pilotId: string;
  pilotName: string;
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
  tracks: string | undefined;
  notes: string;
}
