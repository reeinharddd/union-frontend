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
  //biografia?: string;
  cv_url?: string;
  cv_publico?: boolean;
  creado_en?: string;
  actualizado_en?: string;
  nombre?: string;
  rol_id: number;
}

export interface CreateUserRequest {
  nombre?: string | null;
  correo?: string | null;
  contrasena?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  universidad_id?: number | null;
  telefono?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  //biografia?: string | null;
  cv_url?: string | null;
  cv_publico?: boolean | null;
  rol_id?: number | null; // Asumiendo
}

export interface UpdateUserRequest {
  nombre?: string | null;
  correo?: string | null;
  contrasena?: string | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  rol_id?: number | null;
  universidad_id?: number | null;
  telefono?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  //biografia?: string | null;
  cv_url?: string | null;
  cv_publico?: boolean | null;
}
