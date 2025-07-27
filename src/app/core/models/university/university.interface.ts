export interface University {
  id: number;
  nombre: string;
  dominio_correo: string;
  logo_url?: string;
  estudiantes_count?: number;
  proyectos_count?: number;
  creado_en: string;
}

export interface CreateUniversityRequest {
  nombre: string;
  dominio_correo: string;
  logo_url?: string;
}
