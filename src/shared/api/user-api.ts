import type { AuthProps, AuthResponse } from '../types/api/auth';
import type { FetchResponse, User } from '../types/globals';
import { apiRequest } from './api-request';

export const userApi = {
  getUsers: (page: number): FetchResponse<{ data: User[]; page: number; total_pages: number }> =>
    apiRequest({
      method: 'GET',
      url: `/users?page=${page}`,
    }),

  updateUser: (data: Partial<User> & { id: number }): Promise<FetchResponse<User>> =>
    apiRequest({
      method: 'PATCH',
      url: `/users/${data.id}`,
      data,
    }),

  deleteUser: (id: number): Promise<FetchResponse<void>> =>
    apiRequest({
      method: 'DELETE',
      url: `/users/${id}`,
    }),

  registration: (data: AuthProps): Promise<FetchResponse<AuthResponse>> =>
    apiRequest({
      method: 'POST',
      url: '/register',
      data,
    }),

  create: (data: User): Promise<FetchResponse<AuthResponse>> =>
    apiRequest({
      method: 'POST',
      url: '/users',
      data,
    }),
};
