import { Certificate } from './certificate/certificate.entity';
import { Endorsement } from './endorsement/endorsement.entity';
import { Medical } from './medical/medical.entity';
import { Profile } from './profile/profile.entity';

export class PilotDTO {
  profile?: Profile;
  medical?: Medical;
  certificate?: Certificate;
  endosement?: Endorsement;
}
