import { PilotEntity } from '../pilot/pilot.entity';
import { TrackEntity } from '../track/track.entity';
import { ColumnNumericTransformer } from '../transformers/columnNumeric.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'logs' })
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  pilotId: string;

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

  @Column('numeric', {
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer()
  })
  durationOfFlight: number;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  singleEngineLand: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  simulatorAtd: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  landingsDay: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  landingsNight: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  groundTrainingReceived: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  flightTrainingReceived: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  crossCountry: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  night: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  solo: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  pilotInCommand: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  instrumentActual: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  instrumentSimulated: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  instrumentApproaches: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  instrumentHolds: number | null;

  @Column('numeric', {
    nullable: true,
    precision: 10,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
  })
  instrumentNavTrack: number | null;

  @Column({ nullable: true })
  notes: string | null;

  @OneToMany(() => TrackEntity, (track: TrackEntity) => track.log)
  tracks: TrackEntity[]

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.logs, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity;
}