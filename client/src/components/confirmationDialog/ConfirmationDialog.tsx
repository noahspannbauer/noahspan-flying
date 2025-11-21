// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   Icon,
//   IconName,
//   Loading
// } from '@noahspan/noahspan-components';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Spinner } from '@heroui/react'
import { DialogConfirmationProps } from './ConfirmationDialogProps.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const ConfirmationDialog = ({
  contentText,
  isLoading,
  isOpen,
  onCancel,
  onConfirm,
  title
}: DialogConfirmationProps) => {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {!isLoading && <div>{contentText}</div>}
          {isLoading && <Spinner size='lg' />}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onCancel} startContent={<FontAwesomeIcon icon={faXmark} />}>
            No
          </Button>
          <Button
            color='primary'
            onPress={onConfirm}
            startContent={<FontAwesomeIcon icon={faCircleCheck} />}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationDialog;
