import { LogEntity } from "src/log/log.entity";

export class PilotDto {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email?: string;
  phone?: string;
}
