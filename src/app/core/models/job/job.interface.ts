export interface JobOffer {
  id: number;
  logo_url?: string;
  titulo: string;
  descripcion: string;
  empresa: string;
  ubicacion: string;
  tipo_contrato: string;
  salario?: string;
  fecha_publicacion: string;
  fecha_limite: string;
  creado_por: number;
  estado: 'activo' | 'inactivo' | 'finalizado';
  postulaciones_count: number;
  creado_en: string;
}

export interface JobOffersFilters {
  limit?: number;
  offset?: number;
  empresa?: string;
  ubicacion?: string;
  tipo_contrato?: string;
  salario_min?: number;
  activo?: boolean;
}
