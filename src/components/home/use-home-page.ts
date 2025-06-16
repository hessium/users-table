import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../shared/api/user-api.ts';
import { useEffect, useState } from 'react';
import type { User } from '../../shared/types/globals.ts';

const STORAGE_KEY = 'users_data';

export const usersKeys = {
  all: ['users'] as const,
  users: () => [...usersKeys.all, 'users'] as const,
};

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setCachedData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage:', error);
  }
};

export function useHomePage() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = useInfiniteQuery({
    queryKey: usersKeys.users(),
    queryFn: async ({ pageParam = 1 }) => {
      if (pageParam === 1) {
        const cached = getCachedData();
        if (cached) {
          return cached;
        }
      }
      const data = await userApi.getUsers(pageParam);
      if (pageParam === 1) {
        setCachedData(data);
      }
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleEditUser = (event: CustomEvent<User>) => {
      setEditingUser(event.detail);
    };
    const handleDeleteUser = (event: CustomEvent<User>) => {
      setDeletingUser(event.detail);
    };
    window.addEventListener('editUser', handleEditUser as EventListener);
    window.addEventListener('deleteUser', handleDeleteUser as EventListener);
    return () => {
      window.removeEventListener('editUser', handleEditUser as EventListener);
      window.removeEventListener('deleteUser', handleDeleteUser as EventListener);
    };
  }, []);

  const handleEditSubmit = async (data: Partial<User>) => {
    if (!editingUser) return;
    try {
      await userApi.updateUser({ ...data, id: editingUser.id });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await userApi.deleteUser(deletingUser.id);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeletingUser(null);
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const allUsers = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    ...query,
    allUsers,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    isDeleting,
    handleEditSubmit,
    handleDeleteConfirm,
  };
}
