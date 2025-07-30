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
  descripcion: string;
}

/**
 * DTO para actualizar una página colaborativa existente
 */
export interface UpdateColabPageRequest {
  titulo?: string;
  descripcion?: string;
  permisos_lectura?: string[];
  permisos_escritura?: string[];
  orden?: number;
}


// src/app/core/models/project/block.interface.ts

/** Tipos de bloque soportados */
export type BlockType = 'texto' | 'imagen' | 'video';

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
  contenido: BlockContent;
  orden: number;
  creado_por: number;
  creado_en: string; // ISO 8601 timestamp
}

/**
 * Payload para reordenar bloques
 */
export interface BlockOrderPayload {
  id: number;
  orden: number;
}
