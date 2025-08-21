import { FormMode } from "../../enums/formMode";

export interface LogTracksProps {
  isDrawerOpen: boolean;
  mode: FormMode;
  onOpenClose: (mode: FormMode) => void;
  selectedLogId: string | undefined;
}