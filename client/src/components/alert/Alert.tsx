import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertProps } from "./AlertProps.interface";
import { faCircleCheck, faCircleInfo, faCircleXmark, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

const Alert = ({
  children,
  className,
  closeIcon,
  severity,
  onClose,
  ...rest
}: AlertProps) => {
  const severityVariants = {
    info: 'alert-info',
    error: 'alert-error',
    success: 'alert-success',
    warning: 'alert-warning'
  };

  return (
    <>
      <div
        role='alert'
        className={`alert ${severity ? severityVariants[severity] : ''} ${className ? className : ''}`}
        {...rest}
      >
        <span>
          {severity === 'info' && <FontAwesomeIcon icon={faCircleInfo} />}
          {severity === 'error' && <FontAwesomeIcon icon={faCircleXmark} />}
          {severity === 'success' && (
            <FontAwesomeIcon icon={faCircleCheck} />
          )}
          {severity === 'warning' && (
            <FontAwesomeIcon icon={faTriangleExclamation} />
          )}
        </span>
        <span>{children}</span>
        {closeIcon && <button className='btn' onClick={onClose}>{<FontAwesomeIcon icon={faXmark} />}</button>}
      </div>
    </>
  );
};

export default Alert;