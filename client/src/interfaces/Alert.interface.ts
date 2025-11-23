export interface Alert {
  severity: 'danger' | 'default' | 'success' | 'warning';
  message: string;
}