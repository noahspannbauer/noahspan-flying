import { PilotEntity } from "src/pilot/pilot.entity";
import { TrackEntity } from "src/track/track.entity";

export class LogDto {
  pilotId: string;
  date: Date;
  aircraftMakeModel: string;
  aircraftIdentity: string;
  routeFrom: string;
  routeTo: string;
  durationOfFlight?: number;
  singleEngineLand?: number;
  simulatorAtd?: number;
  landingsDay?: number;
  landingsNight?: number;
  instrumentActual?: number;
  instrumentSimulated?: number;
  instrumentApproaches?: number;
  instrumentHolds?: number;
  instrumentNavTrack?: number;
  groundTrainingReceived?: number;
  flightTrainingReceived?: number;
  crossCountry?: number;
  night?: number;
  solo?: number;
  pilotInCommand?: number;
  notes?: string;
  pilot?: PilotEntity;
  tracks?: TrackEntity[];
}
