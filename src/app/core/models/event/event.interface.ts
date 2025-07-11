export interface Event {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  creador_id: number;
  universidad_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  enlace_acceso?: string;
  creado_en: string;
}

export interface CreateEventRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  creador_id: number;
  universidad_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  enlace_acceso?: string;
}

export interface EventAttendance {
  id: number;
  evento_id: number;
  usuario_id: number;
  registrado_en: string;
}
