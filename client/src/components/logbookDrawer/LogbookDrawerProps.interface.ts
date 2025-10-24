import { FormMode } from "../../enums/formMode";

export interface LogbookDrawerProps {
  onOpenClose: (mode: FormMode) => void;
}