export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  creador_id: number;
  creador_nombre: string;
  universidad_id: number;
  universidad_nombre: string;
  estado_verificacion: 'pendiente' | 'aprobado' | 'rechazado';
  vista_publica: boolean;
  repositorio_url?: string;
  demo_url?: string;
  creado_en: string;
  participantes_count: number;
  tecnologias: string[];
  likes_count: number;
}

export interface CreateProjectRequest {
  nombre: string;
  descripcion: string;
  universidad_id: number;
  repositorio_url?: string;
  demo_url?: string;
  vista_publica?: boolean;
}

export interface ProjectsFilters {
  limit?: number;
  offset?: number;
  universidad_id?: number;
  creador_id?: number;
  estado_verificacion?: string;
  vista_publica?: boolean;
  search?: string;
}

export interface ProjectsResponse {
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
