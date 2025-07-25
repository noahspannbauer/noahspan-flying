// import { EntityString } from '@noahspan/azure-database';

// export class Pilot {
//   @EntityString() partitionKey: string;
//   @EntityString() rowKey: string;
//   @EntityString() id: string;
//   @EntityString() name: string;
//   @EntityString() address?: string;
//   @EntityString() city?: string;
//   @EntityString() state?: string;
//   @EntityString() postalCode?: string;
//   @EntityString() email?: string;
//   @EntityString() phone?: string;
//   @EntityString() medicalClass?: string;
//   @EntityString() medicalExpiration: string;
//   @EntityString() certificates: string;
//   @EntityString() endorsements: string;
// }

import { LogEntity } from 'src/log/log.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CertificateEntity } from '../certificate/certificate.entity';
import { EndorsementEntity } from 'src/endorsement/endorsement.entity';
import { MedicalEntity } from 'src/medical/medical.entity';

@Entity({ name: 'pilots' })
export class PilotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => LogEntity, (log: LogEntity) => log.pilot, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  logs: LogEntity[];

  @OneToMany(() => CertificateEntity, (certificate: CertificateEntity) => certificate.pilot, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  certificates: CertificateEntity[];

  @OneToMany(() => EndorsementEntity, (endorsement: EndorsementEntity) => endorsement.pilot, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  endorsements: EndorsementEntity[];
  
  @OneToMany(() => MedicalEntity, (medical: MedicalEntity) => medical.pilot, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  medical: MedicalEntity[];
}
