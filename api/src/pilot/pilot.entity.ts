import { EntityString } from '@noahspan/azure-database';

export class Pilot {
  @EntityString() partitionKey: string;
  @EntityString() rowKey: string;
  @EntityString() id: string;
  @EntityString() name: string;
  @EntityString() address?: string;
  @EntityString() city?: string;
  @EntityString() state?: string;
  @EntityString() postalCode?: string;
  @EntityString() email?: string;
  @EntityString() phone?: string;
  @EntityString() medicalClass?: string;
  @EntityString() medicalExpiration: string;
  @EntityString() certificates: string;
}
