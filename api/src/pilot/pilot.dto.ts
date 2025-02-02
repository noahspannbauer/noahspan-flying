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
}
