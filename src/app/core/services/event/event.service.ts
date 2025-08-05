import { computed, Injectable, signal } from '@angular/core';
import {
  CreateEventRequest,
  Event,
  EventAttendance,
  EventsFilters,
  EventsResponse,
} from '@app/core/models/event/event.interface';
import { map, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class EventService extends BaseService {
  protected readonly serviceName = 'EventService';

  // Estado local
  private readonly _events = signal<Event[]>([]);
  private readonly _attendances = signal<EventAttendance[]>([]);
  private readonly _totalEvents = signal(0);

  readonly events = this._events.asReadonly();
  readonly attendances = this._attendances.asReadonly();
  readonly totalEvents = this._totalEvents.asReadonly();

  // Estados computados
  readonly upcomingEvents = computed(() => {
    const now = new Date();
    return this._events().filter(event => new Date(event.fecha_inicio) > now);
  });

  readonly virtualEvents = computed(() => this._events().filter(event => event.es_virtual));

  readonly myRegisteredEvents = computed(() => {
    const currentUser = this.appState.currentUser();
    if (!currentUser) return [];

    const myAttendances = this._attendances().filter(att => att.usuario_id === currentUser.id);
    const eventIds = myAttendances.map(att => att.evento_id);

    return this._events().filter(event => eventIds.includes(event.id));
  });

  getAll(filters: EventsFilters = {}): Observable<Event[]> {
    return this.handleRequest(
      this.apiClient.get<EventsResponse | Event[]>(API_ENDPOINTS.EVENTS.BASE, filters),
      'events.getAll',
      { logRequest: true },
    ).pipe(
      map(response => {
        // Handle both array response and object response with data
        if (Array.isArray(response)) {
          // Direct array response
          this._events.set(response);
          this._totalEvents.set(response.length);
          return response;
        } else {
          // Object response with data and pagination
          this._events.set(response.data);
          this._totalEvents.set(response.pagination.total);
          return response.data;
        }
      }),
    );
  }

  getById(id: number): Observable<Event> {
    return this.handleRequest(
      this.apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id)),
      `events.getById.${id}`,
      { logRequest: true },
    );
  }

  create(eventData: CreateEventRequest): Observable<Event> {
    return this.handleRequest(
      this.apiClient.post<Event>(API_ENDPOINTS.EVENTS.BASE, eventData),
      'events.create',
      {
        showSuccessToast: true,
        successMessage: 'Evento creado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(newEvent => {
        this._events.update(events => [...events, newEvent]);
        this._totalEvents.update(total => total + 1);
      }),
    );
  }

  update(id: number, eventData: Partial<CreateEventRequest>): Observable<Event> {
    return this.handleRequest(
      this.apiClient.put<Event>(API_ENDPOINTS.EVENTS.BY_ID(id), eventData),
      `events.update.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Evento actualizado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedEvent => {
        this._events.update(events =>
          events.map(event => (event.id === id ? updatedEvent : event)),
        );
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(API_ENDPOINTS.EVENTS.BY_ID(id)),
      `events.delete.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Evento eliminado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._events.update(events => events.filter(event => event.id !== id));
        this._totalEvents.update(total => total - 1);
      }),
    );
  }

  // Gestión de asistencias
  getAttendances(): Observable<EventAttendance[]> {
    return this.handleRequest(
      this.apiClient.get<EventAttendance[]>(API_ENDPOINTS.EVENTS.ATTENDANCES),
      'events.getAttendances',
      { logRequest: true },
    ).pipe(
      tap(attendances => {
        this._attendances.set(attendances);
      }),
    );
  }

  registerAttendance(eventId: number): Observable<EventAttendance> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const attendanceData = {
      evento_id: eventId,
      usuario_id: currentUser.id,
    };

    return this.handleRequest(
      this.apiClient.post<EventAttendance>(API_ENDPOINTS.EVENTS.ATTENDANCES, attendanceData),
      `events.registerAttendance.${eventId}`,
      {
        showSuccessToast: true,
        successMessage: 'Registrado exitosamente al evento',
        logRequest: true,
      },
    ).pipe(
      tap(attendance => {
        this._attendances.update(attendances => [...attendances, attendance]);

        // Actualizar contador en el evento
        this._events.update(events =>
          events.map(event =>
            event.id === eventId
              ? { ...event, asistentes_registrados: event.asistentes_registrados + 1 }
              : event,
          ),
        );
      }),
    );
  }

  unregisterAttendance(eventId: number): Observable<{ message: string }> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Encontrar la asistencia para eliminarla
    const attendance = this._attendances().find(
      att => att.evento_id === eventId && att.usuario_id === currentUser.id,
    );

    if (!attendance) {
      throw new Error('No estás registrado en este evento');
    }

    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(
        `${API_ENDPOINTS.EVENTS.ATTENDANCES}/${attendance.id}`,
      ),
      `events.unregisterAttendance.${eventId}`,
      {
        showSuccessToast: true,
        successMessage: 'Registro cancelado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._attendances.update(attendances =>
          attendances.filter(att => att.id !== attendance.id),
        );

        // Actualizar contador en el evento
        this._events.update(events =>
          events.map(event =>
            event.id === eventId
              ? { ...event, asistentes_registrados: Math.max(0, event.asistentes_registrados - 1) }
              : event,
          ),
        );
      }),
    );
  }

  isRegisteredToEvent(eventId: number): boolean {
    const currentUser = this.appState.currentUser();
    if (!currentUser) return false;

    return this._attendances().some(
      att => att.evento_id === eventId && att.usuario_id === currentUser.id,
    );
  }
}
