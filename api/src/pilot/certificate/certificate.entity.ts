export class Certificate {
  partitionKey: string;
  rowKey: string;
  type: string;
  issueDate: Date;
  number?: string;
}
