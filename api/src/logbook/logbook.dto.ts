export class LogbookDto {
  pilotId: string;
  pilotName: string;
  date: string;
  aircraftMakeModel: string;
  aircraftIdentity: string;
  routeFrom: string;
  routeTo: string;
  durationOfFlight: number;
  singleEngineLand: string;
  simulatorAtd: number;
  landingsDay: number;
  landingsNight: number;
  instrumentActual: number;
  instrumentSimulated: number;
  instrumentApproaches: number;
  instrumentHolds: number;
  instrumentNavTrack: number;
  groundTrainingReceived: number;
  flightTrainingReceived: number;
  crossCountry: number;
  night: number;
  solo: number;
  pilotInCommand: number;
  notes: string;
}
