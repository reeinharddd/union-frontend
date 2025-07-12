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
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  address?: string;
}
