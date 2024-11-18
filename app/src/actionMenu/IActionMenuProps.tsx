import { FormMode } from '../enums/formMode';

export interface IActionMenuProps {
  id: string;
  onOpenCloseForm: (formMode: FormMode, id: string) => void;
}
