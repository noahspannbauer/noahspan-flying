import { FormMode } from "../../enums/formMode";
import { ILogbookEntry } from "../logbook/ILogbookEntry";

export interface LogbookCardProps {
  logs: ILogbookEntry[];
  mode: 'flights' | 'logbook';
  onDelete?: (entryId: string) => void;
  onOpenCloseForm?: (formMode: FormMode, id: string) => void;
}