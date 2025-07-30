// Fabian Mendoza

/**
 * Representa una página colaborativa de un proyecto
 */
export interface ColabPage {
  id: number;
  proyecto_id: number;
  titulo: string;
  descripcion: string;
  creada_por: number;
  permisos_lectura: string[];
  permisos_escritura: string[];
  orden: number;
  creada_en: string; // ISO 8601 timestamp
}

/**
 * DTO para crear una nueva página colaborativa
 */
export interface CreateColabPageRequest {
  titulo: string;
  proyecto_id: number;
  descripcion: string;
  permisos_lectura: string[];
  permisos_escritura: string[];
  orden: number;
}
export interface UpdateColabPageRequest {
  titulo?: string;
  descripcion?: string;
}

export type BlockType = 'texto' | 'video' | 'embed';

export interface Block {
  id: number;
  pagina_id: number;
  tipo: BlockType;
  contenido: { text?: string; videoUrl?: string; embedUrl?: string };
  orden: number;
  creado_por: number;
  creada_en: string;
}

export interface CreateBlockRequest {
  tipo: BlockType;
  contenido: { text?: string; videoUrl?: string; embedUrl?: string };
  orden?: number;
}

/** Contenido de un bloque de texto */
export interface TextContent {
  text: string;
}

/** Contenido de un bloque de imagen */
export interface ImageContent {
  url: string;
  alt?: string;
}

/** Contenido de un bloque de video embebido */
export interface VideoContent {
  url: string;
}

/** Unión de posibles contenidos de bloque */
export type BlockContent = TextContent | ImageContent | VideoContent;

/**
 * Representa un bloque dentro de una página colaborativa
 */
export interface Block {
  id: number;
  pagina_id: number;
  tipo: BlockType;
  contenido: { text?: string; videoUrl?: string; embedUrl?: string };
  orden: number;
  creado_por: number;
  creada_en: string;
}

export interface CreateBlockRequest {
  tipo: BlockType;
  contenido: { text?: string; videoUrl?: string; embedUrl?: string };
  orden?: number;
}
