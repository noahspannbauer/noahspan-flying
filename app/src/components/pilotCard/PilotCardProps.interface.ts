import { FormMode } from "../../enums/formMode";
import { Pilot } from "../pilots/Pilot.interface";

export interface PilotCardProps {
  pilots: Pilot[];
  onDelete: (entryId: string) => void;
  onOpenCloseForm: (formMode: FormMode, id: string) => void;
}