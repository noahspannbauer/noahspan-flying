export interface AlertProps {
  children?: React.ReactNode;
  className?: string;
  closeIcon?: React.ReactNode;
  onClose?: () => void;
  severity: 'info' | 'error' | 'success' | 'warning';
}