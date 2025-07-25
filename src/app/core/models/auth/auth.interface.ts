export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  rol_id: string;
  address?: string;
}
