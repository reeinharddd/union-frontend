export interface Event {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  creador_id: number;
  creador_nombre: string;
  universidad_id: number;
  universidad_nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  enlace_acceso?: string;
  ubicacion?: string;
  capacidad_maxima?: number;
  es_virtual: boolean;
  requiere_registro: boolean;
  asistentes_registrados: number;
  creado_en: string;
}

export interface CreateEventRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  fecha_inicio: string;
  fecha_fin?: string;
  enlace_acceso?: string;
  ubicacion?: string;
  capacidad_maxima?: number;
  es_virtual?: boolean;
  requiere_registro?: boolean;
}

export interface EventsFilters {
  limit?: number;
  offset?: number;
  universidad_id?: number;
  tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  es_virtual?: boolean;
}

export interface EventsResponse {
  data: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EventAttendance {
  id: number;
  evento_id: number;
  usuario_id: number;
  registrado_en: string;
}
