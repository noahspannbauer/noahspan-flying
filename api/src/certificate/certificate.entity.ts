import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PilotEntity } from '../pilot/pilot.entity';

@Entity({ name: 'certificates'})
export class CertificateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  number: string;

  @Column()
  issueDate: Date

  @ManyToOne(() => PilotEntity, (pilot: PilotEntity) => pilot.certificates, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pilotId' })
  pilot: PilotEntity;
}