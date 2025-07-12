export interface Opportunity {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  fecha_limite: string;
  creado_en: string;
}

export interface CreateOpportunityRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  fecha_limite: string;
}