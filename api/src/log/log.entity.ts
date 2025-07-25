export class Log {
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
  tracks?: string[];
  notes?: string;
}

import { PilotEntity } from 'src/pilot/pilot.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'logs' })
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  date: Date;

  @Column()
  aircraftMakeModel: string;

  @Column()
  aircraftIdentity: string;

  @Column()
  routeFrom: string;

  @Column()
  routeTo: string;

  @Column()
  durationOfFlight: number;

  @Column()
  singleEngineLand: number;

  @Column()
  simulatorAtd: number;

  @Column()
  landingsDay: number;

  @Column()
  landingsNight: number;

  @Column()
  groundTrainingReceived: number;

  @Column()
  flightTrainingReceived: number;

  @Column()
  crossCountry: number;

  @Column()
  night: number;

  @Column()
  solo: number;

  @Column()
  pilotInCommand: number;

  @Column()
  instrumentActual: number;

  @Column()
  instrumentSimulated: number;

  @Column()
  instrumentApproaches: number;

  @Column()
  instrumentHolds: number;

  @Column()
  instrumentNavTrack: number;

  @Column()
  notes: string;

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.logs)
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity;
}