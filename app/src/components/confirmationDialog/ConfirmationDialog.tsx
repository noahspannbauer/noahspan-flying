import {
  Box,
  Button,
  CircleCheckIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Spinner,
  XmarkIcon
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
        <Button onClick={onCancel} variant="outlined" startIcon={<XmarkIcon />}>
          No
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          startIcon={<CircleCheckIcon />}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
