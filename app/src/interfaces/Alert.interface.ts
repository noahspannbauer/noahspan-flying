export interface Alert {
  severity: 'success' | 'error' | 'info' | 'warning';
  message: string;
}