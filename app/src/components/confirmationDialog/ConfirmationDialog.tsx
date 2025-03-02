import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  Spinner
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
      onClose={onCancel}
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': { width: '2000px' }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        {!isLoading && <DialogContentText>{contentText}</DialogContentText>}
        {isLoading && <Spinner />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" startIcon={<Icon iconName='fa-xmark' />}>
          No
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={<Icon iconName='fa-circle-check' />}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
