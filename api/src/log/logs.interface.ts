import { LogEntity } from "src/log/log.entity";

export interface Logs {
  entities: LogEntity[],
  total: number,
  hasNextPage: boolean
}