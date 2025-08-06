import { computed, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { BaseService } from '../base/base.service';

// Interfaces para las asistencias a eventos
export interface AsistenciaEvento {
  id: number;
  evento_id: number;
  usuario_id: number;
  registrado_en: string;
  // Datos relacionados que pueden venir del backend
  evento?: {
    id: number;
    titulo: string;
    fecha_inicio: string;
    modalidad: string;
  };
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface CreateAsistenciaRequest {
  evento_id: number;
  usuario_id?: number; // Opcional, se puede obtener del usuario actual
}

export interface UpdateAsistenciaRequest {
  evento_id?: number;
  usuario_id?: number;
}

export interface AsistenciasFilters {
  evento_id?: number;
  usuario_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}

export interface AsistenciasResponse {
  data: AsistenciaEvento[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Servicio para gestionar asistencias a eventos
 *
 * Endpoints disponibles en '/asistencias-eventos':
 * - GET /asistencias-eventos - Obtener todas las asistencias
 * - POST /asistencias-eventos - Registrarse a un evento
 * - GET /asistencias-eventos/:id - Obtener asistencia por ID
 * - PUT /asistencias-eventos/:id - Actualizar asistencia
 * - DELETE /asistencias-eventos/:id - Cancelar registro
 *
 * Estructura de datos:
 * - id: number
 * - evento_id: number
 * - usuario_id: number
 * - registrado_en: string (fecha de registro)
 */
@Injectable({
  providedIn: 'root',
})
export class AsistenciaEventosService extends BaseService {
  protected readonly serviceName = 'AsistenciaEventosService';

  // Estado local
  private readonly _asistencias = signal<AsistenciaEvento[]>([]);
  private readonly _totalAsistencias = signal(0);
  private readonly _isLoading = signal(false);

  readonly asistencias = this._asistencias.asReadonly();
  readonly totalAsistencias = this._totalAsistencias.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Estados computados
  readonly misAsistencias = computed(() => {
    const currentUser = this.appState.currentUser();
    if (!currentUser) return [];
    return this._asistencias().filter(asistencia => asistencia.usuario_id === currentUser.id);
  });

  readonly totalMisAsistencias = computed(() => this.misAsistencias().length);

  // API Base Endpoint
  private readonly baseEndpoint = '/asistencias-eventos';

  /**
   * Obtener todas las asistencias con filtros opcionales
   */
  getAll(filters: AsistenciasFilters = {}): Observable<AsistenciaEvento[]> {
    this._isLoading.set(true);

    return this.handleRequest(
      this.apiClient.get<AsistenciasResponse | AsistenciaEvento[]>(this.baseEndpoint, filters),
      'asistencias.getAll',
      { logRequest: true },
    ).pipe(
      map(response => {
        // Handle both array response and object response with data
        if (Array.isArray(response)) {
          // Direct array response
          this._asistencias.set(response);
          this._totalAsistencias.set(response.length);
          return response;
        } else {
          // Object response with data and pagination
          this._asistencias.set(response.data);
          this._totalAsistencias.set(response.pagination.total);
          return response.data;
        }
      }),
      tap(() => this._isLoading.set(false)),
    );
  }

  /**
   * Obtener asistencia por ID
   */
  getById(id: number): Observable<AsistenciaEvento> {
    return this.handleRequest(
      this.apiClient.get<AsistenciaEvento>(`${this.baseEndpoint}/${id}`),
      `asistencias.getById.${id}`,
      { logRequest: true },
    );
  }

  /**
   * Obtener asistencias de un evento específico
   */
  getByEventoId(eventoId: number): Observable<AsistenciaEvento[]> {
    return this.getAll({ evento_id: eventoId });
  }

  /**
   * Obtener mis asistencias
   */
  getMisAsistencias(): Observable<AsistenciaEvento[]> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    return this.getAll({ usuario_id: currentUser.id });
  }

  /**
   * Registrarse a un evento
   */
  registrarseEvento(eventoId: number): Observable<AsistenciaEvento> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const asistenciaData: CreateAsistenciaRequest = {
      evento_id: eventoId,
      usuario_id: currentUser.id,
    };

    return this.handleRequest(
      this.apiClient.post<AsistenciaEvento>(this.baseEndpoint, asistenciaData),
      `asistencias.registrar.${eventoId}`,
      {
        showSuccessToast: true,
        successMessage: 'Te has registrado exitosamente al evento',
        logRequest: true,
      },
    ).pipe(
      tap(newAsistencia => {
        this._asistencias.update(asistencias => [...asistencias, newAsistencia]);
        this._totalAsistencias.update(total => total + 1);
      }),
    );
  }

  /**
   * Cancelar registro a un evento
   */
  cancelarRegistro(asistenciaId: number): Observable<{ message: string }> {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(`${this.baseEndpoint}/${asistenciaId}`),
      `asistencias.cancelar.${asistenciaId}`,
      {
        showSuccessToast: true,
        successMessage: 'Registro cancelado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._asistencias.update(asistencias =>
          asistencias.filter(asistencia => asistencia.id !== asistenciaId),
        );
        this._totalAsistencias.update(total => total - 1);
      }),
    );
  }

  /**
   * Cancelar registro por evento ID (más conveniente para el frontend)
   */
  cancelarRegistroPorEvento(eventoId: number): Observable<{ message: string }> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Buscar la asistencia del usuario actual para este evento
    const asistencia = this._asistencias().find(
      a => a.evento_id === eventoId && a.usuario_id === currentUser.id,
    );

    if (!asistencia) {
      throw new Error('No estás registrado en este evento');
    }

    return this.cancelarRegistro(asistencia.id);
  }

  /**
   * Actualizar estado de asistencia (para administradores)
   */
  updateAsistencia(id: number, data: UpdateAsistenciaRequest): Observable<AsistenciaEvento> {
    return this.handleRequest(
      this.apiClient.put<AsistenciaEvento>(`${this.baseEndpoint}/${id}`, data),
      `asistencias.update.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Asistencia actualizada exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedAsistencia => {
        this._asistencias.update(asistencias =>
          asistencias.map(asistencia => (asistencia.id === id ? updatedAsistencia : asistencia)),
        );
      }),
    );
  }

  /**
   * Marcar asistencia (método removido - no aplica con la estructura actual)
   */
  // marcarAsistencia removido

  /**
   * Confirmar registro (método removido - no aplica con la estructura actual)
   */
  // confirmarRegistro removido

  /**
   * Verificar si el usuario actual está registrado en un evento
   */
  isRegistradoEnEvento(eventoId: number): boolean {
    const currentUser = this.appState.currentUser();
    if (!currentUser) return false;

    return this._asistencias().some(
      asistencia => asistencia.evento_id === eventoId && asistencia.usuario_id === currentUser.id,
    );
  }

  /**
   * Obtener asistencia del usuario actual para un evento
   */
  getAsistenciaParaEvento(eventoId: number): AsistenciaEvento | null {
    const currentUser = this.appState.currentUser();
    if (!currentUser) return null;

    return (
      this._asistencias().find(
        asistencia => asistencia.evento_id === eventoId && asistencia.usuario_id === currentUser.id,
      ) || null
    );
  }

  /**
   * Obtener estadísticas de asistencias para un evento
   */
  getEstadisticasEvento(eventoId: number): {
    total: number;
    registrados: number;
  } {
    const asistenciasEvento = this._asistencias().filter(a => a.evento_id === eventoId);

    return {
      total: asistenciasEvento.length,
      registrados: asistenciasEvento.length,
    };
  }

  /**
   * Limpiar estado local
   */
  clearState(): void {
    this._asistencias.set([]);
    this._totalAsistencias.set(0);
    this._isLoading.set(false);
  }

  /**
   * Refrescar asistencias
   */
  refresh(filters: AsistenciasFilters = {}): Observable<AsistenciaEvento[]> {
    return this.getAll(filters);
  }
}
