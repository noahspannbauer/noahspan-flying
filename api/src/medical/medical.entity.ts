import { PilotEntity } from 'src/pilot/pilot.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'medical' })
export class MedicalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  class: string;

  @Column()
  expirationDate: Date;

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.medical, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity;
}