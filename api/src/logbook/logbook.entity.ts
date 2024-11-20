export class LogbookEntity {
  partitionKey: string;
  rowKey: string;
  pilotId: string;
  pilotName: string;
  date: string;
  aircraftMakeModel: string;
  aircraftIdentity: string;
  routeFrom: string;
  routeTo: string;
  durationOfFlight: number | null;
  singleEngineLand: number | null;
  simulatorAtd?: number | null;
  landingsDay?: number | null;
  landingsNight?: number | null;
  groundTrainingReceived?: number;
  flightTrainingReceived?: number;
  crossCountry?: number | null;
  night?: number | null;
  solo?: number | null;
  pilotInCommand?: number | null;
  instrumentActual?: number | null;
  instrumentSimulated?: number | null;
  instrumentApproaches?: number | null;
  instrumentHolds?: number | null;
  instrumentNavTrack?: number | null;
  notes?: string;
}
