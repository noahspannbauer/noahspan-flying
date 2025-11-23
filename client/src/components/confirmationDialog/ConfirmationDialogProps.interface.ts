export interface DialogConfirmationProps {
  contentText: string;
  isLoading: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}
