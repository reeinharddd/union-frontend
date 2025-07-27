export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
  role?: string;
  address?: string;
}

export interface UpdateUserRequest {
  nombre?: string;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
  biografia?: string;
  cv_url?: string;
  cv_publico?: boolean;
}
