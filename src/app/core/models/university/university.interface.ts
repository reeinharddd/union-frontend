export interface University {
  id: number;
  nombre: string;
  dominio_correo: string;
  logo_url?: string;
}

export interface CreateUniversityRequest {
  nombre: string;
  dominio_correo: string;
  logo_url?: string;
}
