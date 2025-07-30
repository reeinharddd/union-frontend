// Fabian Mendoza
/** Representa un bloque dentro de una página colaborativa */
export interface Block {
  id: number;
  pagina_id: number;
  tipo: string;
  /** Contenido del bloque, al ser JSONB puede ser cualquier objeto */
  contenido: any;
  orden: number;
  creado_por: number;
  creada_en: string;
}

export interface CreateBlockRequest {
  tipo: string;
  contenido: any;
  orden?: number;
}

export type UpdateBlockRequest = Partial<CreateBlockRequest>;
