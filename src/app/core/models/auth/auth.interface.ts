// auth.interfaces.ts
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contraseña: string;
  rol_id?: number;
  universidad_id?: number;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UsersFilters {
  limit?: number;
  offset?: number;
  search?: string;
  universidad_id?: number;
  rol_id?: number;
  is_active?: boolean;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  universidad_id?: number;
  verificado: boolean;
  is_active: boolean;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
  biografia?: string;
  cv_publico?: boolean;
  last_login_at?: string;
  creado_en: string;
}
