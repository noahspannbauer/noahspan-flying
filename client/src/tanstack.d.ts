import '@tanstack/react-table';

/* eslint-disable */
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'text-left' | 'text-center' | 'text-right';
    className?: string;
    headerAlign?: 'text-left' | 'text-center' | 'text-right';
  }
}
/* eslint-enable */
