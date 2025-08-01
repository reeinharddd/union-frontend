export interface User {
  id: number;
  correo: string;
  contrasena?: string;
  is_active: boolean;
  is_verified: boolean;
  universidad_id?: number;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
  biografia?: string;
  cv_url?: string;
  cv_publico?: boolean;
  creado_en?: string;
  actualizado_en?: string;
  nombre?: string;
  rol_id: number;
}

export interface CreateUserRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  is_active?: boolean;
  is_verified?: boolean;
  universidad_id?: number;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
  biografia?: string;
  cv_url?: string;
  cv_publico?: boolean;
  rol_id: number; // Asumiendo
}

export interface UpdateUserRequest {
  nombre?: string;
  correo?: string;
  contrasena?: string;
  is_active?: boolean;
  is_verified?: boolean;
  rol_id?: number;
  universidad_id?: number;
  telefono?: string;
  github_url?: string;
  linkedin_url?: string;
  biografia?: string;
  cv_url?: string;
  cv_publico?: boolean;
}
