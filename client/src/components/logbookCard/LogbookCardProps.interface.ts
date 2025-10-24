import { FormMode } from "../../enums/formMode";
import { LogbookEntry } from "../logbook/LogbookEntry.interface";

export interface LogbookCardProps {
  logs: LogbookEntry[];
  mode: 'flights' | 'logbook';
  onDelete?: (entryId: string) => void;
  onOpenCloseForm?: (formMode: FormMode, id: string) => void;
}