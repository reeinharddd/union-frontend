export interface Forum {
  id: number;
  nombre: string;
  descripcion?: string;
  creado_en: string;
}

export interface CreateForumRequest {
  nombre: string;
  descripcion?: string;
}