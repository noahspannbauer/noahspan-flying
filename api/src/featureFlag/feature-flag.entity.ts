import { EntityString } from '@noahspan/azure-database';

export class FeatureFlag {
  @EntityString() partitionKey: string;
  @EntityString() rowKey: string;
  @EntityString() active: string;
}
