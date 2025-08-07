import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiClientService } from '../base/api-client.service';

// Interfaces para eventos según SRS UniON REQ-4.14 y REQ-4.15
export interface EventoUniversitario {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  creador_id: number;
  universidad_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  enlace_acceso?: string;
  creado_en?: string;
  event_type_id: number;
  state_id: number;
  ubicacion?: string;
  capacidad_maxima?: number;
  updated_at?: string;
}

export interface EventoCreacionRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  creador_id: number; // Agregar campo requerido por el backend
  fecha_inicio: string;
  fecha_fin: string;
  enlace_acceso?: string;
  event_type_id: number;
  state_id: number;
  ubicacion?: string;
  capacidad_maxima?: number;
}

export interface EventoActualizacionRequest extends Partial<EventoCreacionRequest> {
  state_id?: number;
}

export interface EventoFiltros {
  fecha_desde?: string;
  fecha_hasta?: string;
  event_type_id?: number;
  state_id?: number;
  universidad_id?: number;
  tipo?: string;
  page?: number;
  limit?: number;
}

export interface EventoResponse {
  evento: EventoUniversitario;
  total_registros?: number;
}

export interface EventosListResponse {
  eventos: EventoUniversitario[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TipoEvento {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EstadoEvento {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUniEventsService {
  constructor(private apiClient: ApiClientService) {}

  /**
   * Crear un nuevo evento universitario
   * REQ-4.14.1: Solo universidades pueden crear eventos
   */
  crearEvento(eventoData: EventoCreacionRequest): Observable<EventoResponse> {
    return this.apiClient.post<EventoResponse>('/eventos', eventoData);
  }

  /**
   * Obtener todos los eventos de la universidad
   * REQ-4.14.2: Mostrar eventos disponibles
   */
  obtenerEventos(filtros?: EventoFiltros): Observable<EventosListResponse> {
    console.log('🌐 === LLAMADA AL BACKEND - obtenerEventos ===');
    console.log('📥 Filtros recibidos en servicio:', filtros);

    const params = this.construirParametros(filtros);
    console.log('🔗 Parámetros construidos:', params);
    console.log('🌐 Endpoint completo: /eventos con parámetros:', params);

    const request = this.apiClient.get<EventosListResponse>('/eventos', { params });
    console.log('📡 Realizando petición HTTP GET...');

    return request.pipe(
      tap({
        next: (response: any) => {
          console.log('✅ Respuesta exitosa del backend:', response);
          console.log('📊 Tipo de respuesta:', typeof response);
          console.log('🔍 Es array?', Array.isArray(response));
          if (response && typeof response === 'object' && 'eventos' in response) {
            console.log(
              '📊 Cantidad de eventos en respuesta:',
              (response as any).eventos?.length || 0,
            );
          }
        },
        error: (error: any) => {
          console.error('❌ Error en la petición HTTP:', error);
          console.error('📊 Status del error:', error.status);
          console.error('📄 Mensaje del error:', error.message);
          console.error('🔗 URL que falló:', error.url);
        },
      }),
    );
  }

  /**
   * Obtener evento por ID
   * REQ-4.14.5: Mostrar información detallada del evento
   */
  obtenerEventoPorId(eventoId: number): Observable<EventoResponse> {
    return this.apiClient.get<EventoResponse>(`/eventos/${eventoId}`);
  }

  /**
   * Actualizar evento existente
   * REQ-4.14.1: Solo universidades pueden editar eventos
   */
  actualizarEvento(
    eventoId: number,
    eventoData: EventoActualizacionRequest,
  ): Observable<EventoResponse> {
    return this.apiClient.put<EventoResponse>(`/eventos/${eventoId}`, eventoData);
  }

  /**
   * Eliminar evento
   * REQ-4.14.1: Solo universidades pueden eliminar eventos
   */
  eliminarEvento(eventoId: number): Observable<{ message: string }> {
    return this.apiClient.delete<{ message: string }>(`/eventos/${eventoId}`);
  }

  /**
   * Cambiar estado del evento usando PUT estándar
   * REQ-4.14.1: Control de estado del evento
   */
  cambiarEstadoEvento(eventoId: number, stateId: number): Observable<EventoResponse> {
    return this.apiClient.put<EventoResponse>(`/eventos/${eventoId}`, {
      state_id: stateId,
    });
  }

  /**
   * Obtener estadísticas de eventos para la universidad
   * Para dashboard de administración universitaria
   */
  obtenerEstadisticasEventos(): Observable<{
    total_eventos: number;
    eventos_activos: number;
    eventos_proximos: number;
    eventos_finalizados: number;
    total_registros: number;
    capacidad_utilizada: number;
  }> {
    // Simulación temporal hasta que se implemente en backend
    return new Observable(observer => {
      const statsSimuladas = {
        total_eventos: 0,
        eventos_activos: 0,
        eventos_proximos: 0,
        eventos_finalizados: 0,
        total_registros: 0,
        capacidad_utilizada: 0,
      };
      observer.next(statsSimuladas);
      observer.complete();
    });
  }

  /**
   * Obtener lista de asistentes por evento
   * REQ-4.15.3: Consultar listado de asistentes
   */
  obtenerAsistentesEvento(eventoId: number): Observable<{
    asistentes: Array<{
      id: number;
      nombre_completo: string;
      email: string;
      universidad: string;
      rol: string;
      fecha_registro: string;
      asistio: boolean;
    }>;
    total: number;
  }> {
    return new Observable(observer => {
      // Simulación temporal - usando eventoId para evitar warning
      const asistentesSimulados = {
        asistentes: [],
        total: 0,
        evento_id: eventoId, // Usar el parámetro para evitar warning
      };
      observer.next(asistentesSimulados);
      observer.complete();
    });
  }

  /**
   * Marcar asistencia de usuario
   * REQ-4.15.1: Registrar asistencia
   */
  marcarAsistencia(
    eventoId: number,
    usuarioId: number,
    asistio: boolean,
  ): Observable<{ message: string }> {
    return new Observable(observer => {
      // Simulación temporal - usando parámetros para evitar warnings
      observer.next({
        message: `Asistencia ${asistio ? 'confirmada' : 'marcada como ausente'} para usuario ${usuarioId} en evento ${eventoId}`,
      });
      observer.complete();
    });
  }

  /**
   * Registrarse en un evento
   * REQ-4.14.4: Permitir registro en eventos
   */
  registrarseEnEvento(eventoId: number): Observable<{ message: string }> {
    return new Observable(observer => {
      // Simulación temporal - usando eventoId para evitar warning
      observer.next({ message: `Registro exitoso en el evento ${eventoId}` });
      observer.complete();
    });
  }

  /**
   * Cancelar registro en evento
   */
  cancelarRegistroEvento(eventoId: number): Observable<{ message: string }> {
    return new Observable(observer => {
      // Simulación temporal - usando eventoId para evitar warning
      observer.next({ message: `Registro cancelado exitosamente para evento ${eventoId}` });
      observer.complete();
    });
  }

  /**
   * Exportar lista de asistentes
   * REQ-4.15.5: Exportar asistentes para reportes
   */

  /**
   * Obtener tipos de eventos disponibles
   * REQ-4.14.3: Filtrar eventos por tipo
   */
  obtenerTiposEventos(): Observable<TipoEvento[]> {
    const tiposEstaticos: TipoEvento[] = [
      { id: 1, nombre: 'Conferencia', descripcion: 'Presentaciones académicas formales' },
      { id: 2, nombre: 'Webinar', descripcion: 'Seminarios virtuales en línea' },
      { id: 3, nombre: 'Taller', descripcion: 'Sesiones prácticas interactivas' },
      { id: 4, nombre: 'Seminario', descripcion: 'Discusiones académicas especializadas' },
      { id: 5, nombre: 'Congreso', descripcion: 'Eventos académicos de gran escala' },
    ];

    return new Observable(observer => {
      observer.next(tiposEstaticos);
      observer.complete();
    });
  }

  /**
   * Obtener estados de eventos disponibles
   */
  obtenerEstadosEventos(): Observable<EstadoEvento[]> {
    const estadosEstaticos: EstadoEvento[] = [
      { id: 1, nombre: 'Activo', descripcion: 'Evento disponible para registro' },
      { id: 2, nombre: 'Inactivo', descripcion: 'Evento temporalmente deshabilitado' },
      { id: 3, nombre: 'Cancelado', descripcion: 'Evento cancelado' },
      { id: 4, nombre: 'Finalizado', descripcion: 'Evento completado' },
    ];

    return new Observable(observer => {
      observer.next(estadosEstaticos);
      observer.complete();
    });
  }

  /**
   * Obtener eventos públicos para estudiantes
   * REQ-4.14.2: Mostrar eventos disponibles a usuarios registrados
   */
  obtenerEventosPublicos(filtros?: EventoFiltros): Observable<EventosListResponse> {
    const params = this.construirParametros(filtros);
    return this.apiClient.get<EventosListResponse>('/eventos', { params });
  }

  /**
   * Construir parámetros para filtros de búsqueda
   * REQ-4.14.3: Filtrar eventos por fecha, tipo y universidad
   */
  private construirParametros(filtros?: EventoFiltros): { [key: string]: string } {
    console.log('🔧 === CONSTRUYENDO PARÁMETROS DE FILTROS ===');
    console.log('📥 Filtros recibidos:', filtros);

    const params: { [key: string]: string } = {};

    if (filtros) {
      console.log('📋 Procesando filtros...');

      if (filtros.fecha_desde) {
        params['fecha_desde'] = filtros.fecha_desde;
        console.log('✅ fecha_desde:', filtros.fecha_desde);
      } else {
        console.log('❌ fecha_desde: no definido');
      }

      if (filtros.fecha_hasta) {
        params['fecha_hasta'] = filtros.fecha_hasta;
        console.log('✅ fecha_hasta:', filtros.fecha_hasta);
      } else {
        console.log('❌ fecha_hasta: no definido');
      }

      if (filtros.event_type_id) {
        params['event_type_id'] = filtros.event_type_id.toString();
        console.log('✅ event_type_id:', filtros.event_type_id);
      } else {
        console.log('❌ event_type_id: no definido');
      }

      if (filtros.state_id) {
        params['state_id'] = filtros.state_id.toString();
        console.log('✅ state_id:', filtros.state_id);
      } else {
        console.log('❌ state_id: no definido');
      }

      if (filtros.universidad_id) {
        params['universidad_id'] = filtros.universidad_id.toString();
        console.log('✅ universidad_id:', filtros.universidad_id);
      } else {
        console.log('❌ universidad_id: no definido');
      }

      if (filtros.tipo) {
        params['tipo'] = filtros.tipo;
        console.log('✅ tipo:', filtros.tipo);
      } else {
        console.log('❌ tipo: no definido');
      }

      if (filtros.page) {
        params['page'] = filtros.page.toString();
        console.log('✅ page:', filtros.page);
      } else {
        console.log('❌ page: no definido');
      }

      if (filtros.limit) {
        params['limit'] = filtros.limit.toString();
        console.log('✅ limit:', filtros.limit);
      } else {
        console.log('❌ limit: no definido');
      }
    } else {
      console.log('⚠️ No se recibieron filtros');
    }

    console.log('🎯 Parámetros finales para el backend:', params);
    console.log('🔢 Total parámetros:', Object.keys(params).length);
    console.log('🌐 URL que se construirá:', `/eventos?${new URLSearchParams(params).toString()}`);
    console.log('🔧 === FIN CONSTRUCCIÓN PARÁMETROS ===');

    return params;
  }

  /**
   * Obtener modalidades estáticas para formularios
   * Basado en el campo 'tipo' de la BD
   */
  obtenerModalidades(): Array<{ value: string; label: string }> {
    return [
      { value: 'presencial', label: 'Presencial' },
      { value: 'virtual', label: 'Virtual' },
      { value: 'hibrido', label: 'Híbrido' },
    ];
  }

  /**
   * Obtener estados comunes para filtros rápidos
   */
  obtenerEstadosComunes(): Array<{ value: number; label: string }> {
    return [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
      { value: 3, label: 'Cancelado' },
      { value: 4, label: 'Finalizado' },
    ];
  }
}
