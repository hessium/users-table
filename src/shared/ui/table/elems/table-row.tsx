import React, { memo } from 'react';
import { cn } from '../../../utils/cn.ts';
import type { TableColumn } from '../table.tsx';
import { Button } from '../../button/button';

export interface TableRowProps<T> {
  row: T;
  columns: TableColumn<T>[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  rowId: string | number;
}

export const TableRow = memo(<T,>({ row, columns, onEdit, onDelete, rowId }: TableRowProps<T>) => {
  return (
    <tr className="relative transition-colors hover:bg-gray-50">
      {columns.map((column) => {
        if (column.isActions) {
          return (
            <td key="actions" className={cn('px-4 py-2 border-b border-gray-100')}>
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="secondary"
                    onClick={() => onEdit(Number(rowId))}
                  >
                    Редактировать
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    onClick={() => onDelete(Number(rowId))}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </td>
          );
        }

        const value = row[column.key as keyof T];
        const displayValue = column.render
          ? column.render(value, row)
          : value === undefined || value === null
            ? ''
            : typeof value === 'number'
              ? value
              : value.toString();

        return (
          <td
            key={column.key.toString()}
            className={cn('px-4 py-2 border-b border-gray-100 text-black')}
          >
            {displayValue}
          </td>
        );
      })}
    </tr>
  );
}) as <T>(props: TableRowProps<T>) => React.JSX.Element;
