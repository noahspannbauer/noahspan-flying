import { PilotEntity } from 'src/pilot/pilot.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'endorsements' })
export class EndorsementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  type: string;

  @Column()
  issueDate: Date;

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.endorsements, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity
}