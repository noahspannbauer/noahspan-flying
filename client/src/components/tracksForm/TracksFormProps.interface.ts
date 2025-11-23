import { FormMode } from "../../enums/formMode";

export interface TracksFormProps {
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
  selectedLogId: string | undefined;
}