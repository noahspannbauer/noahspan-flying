import { FormMode } from "../../enums/formMode";
import { Alert } from "../../interfaces/Alert.interface";
import { Pilot } from "./Pilot.interface";

export interface PilotsState {
  alert: Alert | undefined;
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isFormOpen: boolean;
  isLoading: boolean;
  formMode: FormMode;
  pilots: Pilot[];
  selectedPilotId: string | undefined;
}