// Fabian Mendoza
/** Página colaborativa */
export interface ColabPage {
  id: number;
  proyecto_id: number;
  titulo: string;
  descripcion: string;
  creada_por: number;
  permisos_lectura: string[];
  permisos_escritura: string[];
  orden: number;
  creada_en: string; // ISO timestamp
}

/** Cuerpo al crear o editar una página colaborativa */
export interface CreateColabPageRequest {
  titulo: string;
  descripcion: string;
  orden?: number;
  permisos_lectura?: string[];
  permisos_escritura?: string[];
}

/** Respuesta de permiso */
export interface PermisoResponse {
  permiso: 'edit' | 'view' | 'none';
}
