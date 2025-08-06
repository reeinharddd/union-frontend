export interface Participation {
  id: number;
  usuario_id: number;
  proyecto_id: number;
  estado: string;
  rol_id: number;
  invitado_por?: number;
}
