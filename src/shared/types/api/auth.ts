export interface AuthProps {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  token: string;
}
