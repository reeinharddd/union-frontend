// auth.interfaces.ts
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
 contrasena?: string;
  rol_id?: number;
  universidad_id?: number;
  matricula?: string;
  telefono?: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  biografia?: string | null;
  cv_url?: string | null;
  cv_publico?: boolean;  // Cambiado de 'true' a 'boolean'
}

export interface AuthResponse {
  token: string;
  user: {  // Cambiado de 'usuario' a 'user' para coincidir con tu backend
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;  // Ahora es obligatorio
    universidad_id?: number;
  matricula?: string;
  telefono?: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  biografia?: string | null;
  cv_url?: string | null;
  cv_publico?: true;
  };
}

export interface User {
  id: number;
  nombre: string; // Obligatorio (antes era opcional 'name')
  correo: string; // Cambiado de 'email' a 'correo'
  contrasena?: string; // Cambiado de 'password' a 'contrasena'
  rol_id?: number; // Nuevo campo (según tu API)
  universidad_id?: number;
  matricula?: string;
  telefono?: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  biografia?: string | null;
  cv_url?: string | null;
  cv_publico?: true;
}
