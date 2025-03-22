import { FormMode } from '../../enums/formMode';

export interface IActionMenuProps {
  id: string;
  onDelete: (entryId: string) => void;
  onOpenCloseForm: (formMode: FormMode, id: string) => void;
  onOpenCloseTracks: (formMode: FormMode, id: string) => void;
}
