export interface Forum {
  id: number;
  nombre: string;
  descripcion: string;
  hilos_count: number;
  ultimo_hilo?: {
    id: number;
    titulo: string;
    creado_en: string;
  };
}

export interface Thread {
  id: number;
  foro_id: number;
  foro_nombre: string;
  titulo: string;
  contenido: string;
  creador_id: number;
  creador_nombre: string;
  creado_en: string;
  respuestas_count: number;
  ultima_respuesta?: string;
}

export interface CreateThreadRequest {
  foro_id: number;
  titulo: string;
  contenido: string;
}
