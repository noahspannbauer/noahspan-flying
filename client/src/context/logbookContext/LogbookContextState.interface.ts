import { FormMode } from "../../enums/formMode";
import { Alert } from "../../interfaces/Alert.interface";

export interface LogbookContextState {
  formAlert: Alert | undefined ;
  formMode: FormMode;
  isDrawerOpen: boolean;
  isFormDisabled: boolean;
  isFormLoading: boolean;
  selectedLogId: string | undefined;
}