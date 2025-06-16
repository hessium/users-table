import React, { memo } from 'react';
import { TableRow } from './table-row';
import type { TableColumn } from '../table.tsx';

export interface TableBodyProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string | number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const TableBody = memo(
  <T,>({ data, columns, getRowId, onEdit, onDelete }: TableBodyProps<T>) => {
    return (
      <tbody>
        {data.map((row) => (
          <TableRow<T> 
            key={getRowId(row)} 
            row={row} 
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            rowId={getRowId(row)}
          />
        ))}
      </tbody>
    );
  },
) as <T>(props: TableBodyProps<T>) => React.JSX.Element;
