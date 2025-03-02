import { Certificate } from "./certificate/certificate.entity";
import { Endorsement } from "./endorsement/endorsement.entity";

export class PilotDto {
  partitionKey: string;
  rowKey: string;
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email?: string;
  phone?: string;
  medicalClass?: string;
  medicalExpiration?: string;
  certificates: Certificate;
  endorsements: Endorsement
}
