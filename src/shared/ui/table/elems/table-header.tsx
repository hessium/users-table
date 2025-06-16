import React, { memo } from 'react';
import { cn } from '../../../utils/cn.ts';
import type { TableColumn } from '../table.tsx';

export interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
}

export const TableHeader = memo(<T,>({ columns }: TableHeaderProps<T>) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key.toString()}
            className={cn(
              'font-semibold sticky top-0 z-10 bg-gray-50',
              'px-4 py-2 text-left border-b border-gray-200 text-black',
            )}
          >
            {column.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}) as <T>(props: TableHeaderProps<T>) => React.JSX.Element;
