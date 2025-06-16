import type { TableColumn } from '../ui/table/table';
import type { User } from '../types/globals';

export const columns: TableColumn<User>[] = [
  { key: 'id', title: 'ID' },
  { key: 'first_name', title: 'Имя' },
  { key: 'last_name', title: 'Фамилия' },
  { key: 'email', title: 'Email' },
];
