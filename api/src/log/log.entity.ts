// export class Log {
//   partitionKey: string;
//   rowKey: string;
//   pilotId: string;
//   pilotName: string;
//   date: string;
//   aircraftMakeModel: string;
//   aircraftIdentity: string;
//   routeFrom: string;
//   routeTo: string;
//   durationOfFlight: number | null;
//   singleEngineLand: number | null;
//   simulatorAtd?: number | null;
//   landingsDay?: number | null;
//   landingsNight?: number | null;
//   groundTrainingReceived?: number;
//   flightTrainingReceived?: number;
//   crossCountry?: number | null;
//   night?: number | null;
//   solo?: number | null;
//   pilotInCommand?: number | null;
//   instrumentActual?: number | null;
//   instrumentSimulated?: number | null;
//   instrumentApproaches?: number | null;
//   instrumentHolds?: number | null;
//   instrumentNavTrack?: number | null;
//   tracks?: string[];
//   notes?: string;
// }

import { PilotEntity } from 'src/pilot/pilot.entity';
import { TrackEntity } from 'src/track/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

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

  @Column({ nullable: true })
  singleEngineLand: number | null;

  @Column({ nullable: true })
  simulatorAtd: number | null;

  @Column({ nullable: true })
  landingsDay: number | null;

  @Column({ nullable: true })
  landingsNight: number | null;

  @Column({ nullable: true })
  groundTrainingReceived: number | null;

  @Column({ nullable: true })
  flightTrainingReceived: number | null;

  @Column({ nullable: true })
  crossCountry: number | null;

  @Column({ nullable: true })
  night: number | null;

  @Column({ nullable: true })
  solo: number | null;

  @Column({ nullable: true })
  pilotInCommand: number | null;

  @Column({ nullable: true })
  instrumentActual: number | null;

  @Column({ nullable: true })
  instrumentSimulated: number | null;

  @Column({ nullable: true })
  instrumentApproaches: number | null;

  @Column({ nullable: true })
  instrumentHolds: number | null;

  @Column({ nullable: true })
  instrumentNavTrack: number | null;

  @Column({ nullable: true })
  notes: string | null;

  @OneToMany(() => TrackEntity, (track: TrackEntity) => track.log, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  tracks: TrackEntity[]

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.logs)
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity;
}