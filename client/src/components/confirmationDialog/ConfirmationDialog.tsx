// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   Icon,
//   IconName,
//   Loading
// } from '@noahspan/noahspan-components';
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
    <>
      <input type='checkbox' id='dialog' className='modal-toggle' onChange={() => {}} checked={isOpen} />
      <div className='modal' role='dialog'>
        <div className='modal-box'>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{contentText}</p>
          <div className='modal-action'>
            <button className='btn' onClick={onCancel}>
              <FontAwesomeIcon icon={faXmark} />
              No
            </button>
            <button className='btn btn-primary' onClick={onConfirm}>
              <FontAwesomeIcon icon={faCircleCheck} />
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog;
