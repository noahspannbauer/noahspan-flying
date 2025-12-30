export interface Alert {
  severity: 'info' | 'error' | 'success' | 'warning';
  message: string;
}