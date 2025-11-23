import '@tanstack/react-table';

/* eslint-disable */
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
  }
}
/* eslint-enable */
