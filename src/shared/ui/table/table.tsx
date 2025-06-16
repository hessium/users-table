import type { ReactNode } from 'react';
import { TableHeader } from './elems/table-header';
import { TableBody } from './elems/table-body';

export interface TableColumn<T> {
  key: keyof T | 'actions';
  title: string;
  render?: (value: any, row?: T) => ReactNode;
  isActions?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string | number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export const Table = <T extends object>({
  data,
  columns,
  getRowId,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  const columnsWithActions = [
    ...columns,
    ...(onEdit || onDelete
      ? [{
          key: 'actions' as const,
          title: 'Действия',
          isActions: true
        }]
      : []),
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full">
        <TableHeader<T> columns={columnsWithActions} />
        <TableBody<T>
          data={data}
          columns={columnsWithActions}
          getRowId={getRowId}
          onEdit={onEdit ? (id) => onEdit(data.find(item => getRowId(item) === id)!) : undefined}
          onDelete={onDelete ? (id) => onDelete(data.find(item => getRowId(item) === id)!) : undefined}
        />
      </table>
    </div>
  );
};
