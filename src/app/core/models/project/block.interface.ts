// Fabian Mendoza
export type BlockType = 'texto' | 'video' | 'embed' | 'image';

export interface Block {
  id: number;
  pagina_id: number;
  tipo: 'texto' | 'video' | 'embed' | 'image';
  contenido: {
    text?: string;
    videoUrl?: string;
    embedUrl?: string;
    imageUrl?: string;
    [key: string]: string | undefined;
  };
  orden: number;
  creado_por: number;
  creada_en: string;
}

export interface CreateBlockRequest {
  tipo: BlockType;
  contenido: { text: string } | { videoUrl: string } | { embedUrl: string } | { imageUrl: string };
  orden?: number;
}
export interface UpdateBlockRequest {
  tipo?: BlockType;
  contenido?: { text: string } | { videoUrl: string } | { embedUrl: string } | { imageUrl: string };
  orden?: number;
}
