import { LogEntity } from 'src/log/log.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'tracks' })
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  order: number;

  @ManyToOne(() => LogEntity, (log: LogEntity) => log.tracks)
  @JoinColumn({ name: 'logId' })
  log: LogEntity;
}