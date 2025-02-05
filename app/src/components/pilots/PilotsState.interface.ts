import { FormMode } from "../../enums/formMode";
import { Pilot } from "./Pilot.interface";

export interface PilotsState {
  pilots: Pilot[];
  error: string | undefined;
  isConfirmDialogLoading: boolean;
  isConfirmDialogOpen: boolean;
  isFormOpen: boolean;
  isLoading: boolean;
  formMode: FormMode;
  selectedPilotId: string | undefined;
}