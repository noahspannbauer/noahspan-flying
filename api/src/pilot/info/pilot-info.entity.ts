export class PilotInfoEntity {
  partitionKey: string;
  rowKey: string;
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  email?: string;
  phone?: string;
}
