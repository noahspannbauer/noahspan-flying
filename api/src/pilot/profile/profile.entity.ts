import {
  EntityDateTime,
  EntityPartitionKey,
  EntityRowKey,
  EntityString
} from '@nestjs/azure-database';

@EntityPartitionKey('pilot')
@EntityRowKey('id')
export class Profile {
  @EntityString() firstName: string;
  @EntityString() lastName: string;
  @EntityString() address: string;
  @EntityString() city: string;
  @EntityString() state: string;
  @EntityString() postalCode: string;
  @EntityDateTime() lastFlightReview: Date;
}
