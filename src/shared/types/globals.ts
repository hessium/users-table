export interface ApiResponse<T> {
  data: T;
  error: boolean;
  status: number;
}

export type FetchResponse<T> = Promise<ApiResponse<T>>;

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  birth_date?: Date;
  education?: {
    university: string;
    graduation_year: number;
  };
  work?: {
    company: string;
    responsibilities: string;
  };
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: {
    url: string;
    text: string;
  };
}
