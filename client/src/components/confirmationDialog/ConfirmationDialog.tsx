import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconName,
  Loading
} from '@noahspan/noahspan-components';
import { IDialogConfirmationProps } from './IConfirmationDialogProps';

const ConfirmationDialog = ({
  contentText,
  isLoading,
  isOpen,
  onCancel,
  onConfirm,
  title
}: IDialogConfirmationProps) => {
  return (
    <Dialog
      open={isOpen}
    >
      <h3>{title}</h3>
      <DialogContent>
        {!isLoading && <div>{contentText}</div>}
        {isLoading && <Loading size='xl' />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} startContent={<Icon iconName={IconName.XMARK} />}>
          No
        </Button>
        <Button
          onClick={onConfirm}
          startContent={<Icon iconName={IconName.CIRCLE_CHECK} />}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
