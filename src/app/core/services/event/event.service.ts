import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateEventRequest, Event, EventAttendance } from '../../models/event/event.interface';
import { ApiClientService } from '../base/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly apiClient = inject(ApiClientService);
  private readonly _events = signal<Event[]>([]);
  private readonly _attendances = signal<EventAttendance[]>([]);

  readonly events = this._events.asReadonly();

  // Datos mock para fallback
  private readonly mockEvents: Event[] = [
    {
      id: 1,
      titulo: 'Hackathón Universitario 2024',
      descripcion:
        'Competencia de programación para estudiantes universitarios. Únete y demuestra tus habilidades en desarrollo de software.',
      tipo: 'Hackathón',
      universidad_id: 1,
      fecha_inicio: '2024-08-15T09:00:00Z',
      fecha_fin: '2024-08-17T18:00:00Z',
      enlace_acceso: 'https://meet.google.com/abc-defg-hij',
      creador_id: 1,
      creado_en: '2024-07-01T08:00:00Z',
    },
    {
      id: 2,
      titulo: 'Conferencia de IA y Machine Learning',
      descripcion:
        'Conferencia sobre las últimas tendencias en inteligencia artificial y aprendizaje automático. Speakers internacionales.',
      tipo: 'Conferencia',
      universidad_id: 2,
      fecha_inicio: '2024-09-20T14:00:00Z',
      fecha_fin: '2024-09-20T17:00:00Z',
      enlace_acceso: 'https://zoom.us/j/123456789',
      creador_id: 2,
      creado_en: '2024-07-02T10:30:00Z',
    },
    {
      id: 3,
      titulo: 'Taller de Desarrollo Web',
      descripcion:
        'Taller práctico de desarrollo web con Angular y Node.js. Aprende las mejores prácticas de la industria.',
      tipo: 'Taller',
      universidad_id: 3,
      fecha_inicio: '2024-07-25T10:00:00Z',
      fecha_fin: '2024-07-25T16:00:00Z',
      enlace_acceso: 'https://teams.microsoft.com/l/meetup-join',
      creador_id: 3,
      creado_en: '2024-07-03T12:15:00Z',
    },
    {
      id: 4,
      titulo: 'Simposio de Investigación Estudiantil',
      descripcion:
        'Presentación de proyectos de investigación realizados por estudiantes de pregrado y posgrado.',
      tipo: 'Simposio',
      universidad_id: 4,
      fecha_inicio: '2024-10-10T08:00:00Z',
      fecha_fin: '2024-10-10T17:00:00Z',
      enlace_acceso: 'https://meet.google.com/xyz-uvw-rst',
      creador_id: 4,
      creado_en: '2024-07-04T14:45:00Z',
    },
  ];

  private readonly mockAttendances: EventAttendance[] = [
    { id: 1, evento_id: 1, usuario_id: 2, registrado_en: '2024-07-10T12:00:00Z' },
    { id: 2, evento_id: 1, usuario_id: 3, registrado_en: '2024-07-11T09:30:00Z' },
    { id: 3, evento_id: 2, usuario_id: 4, registrado_en: '2024-07-12T15:45:00Z' },
    { id: 4, evento_id: 3, usuario_id: 5, registrado_en: '2024-07-13T11:20:00Z' },
    { id: 5, evento_id: 4, usuario_id: 2, registrado_en: '2024-07-14T14:30:00Z' },
  ];

  getAll(): Observable<Event[]> {
    console.log('🔄 EventService - Getting all events from API');
    return this.apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.BASE).pipe(
      tap(events => {
        console.log('✅ Events loaded from API:', events.length);
        this._events.set(events);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, using mock events:', error.message);
        this._events.set(this.mockEvents);
        return of(this.mockEvents).pipe(delay(500));
      }),
    );
  }

  getById(id: number): Observable<Event | null> {
    console.log('🔄 EventService - Getting event by ID:', id);
    return this.apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id)).pipe(
      catchError(() => {
        console.warn('⚠️ API unavailable, using mock data for event:', id);
        const mockEvent = this.mockEvents.find(e => e.id === id) || null;
        return of(mockEvent).pipe(delay(300));
      }),
    );
  }

  create(event: CreateEventRequest): Observable<Event> {
    console.log('🔄 EventService - Creating event:', event);
    return this.apiClient.post<Event>(API_ENDPOINTS.EVENTS.BASE, event).pipe(
      tap(newEvent => {
        this._events.update(events => [...events, newEvent]);
        console.log('✅ Event created via API:', newEvent);
      }),
      catchError(() => {
        console.warn('⚠️ API unavailable, simulating event creation');
        const mockEvent: Event = {
          id: Math.max(...this.mockEvents.map(e => e.id)) + Math.floor(Math.random() * 1000),
          ...event,
          creado_en: new Date().toISOString(),
        };
        this._events.update(events => [...events, mockEvent]);
        return of(mockEvent).pipe(delay(500));
      }),
    );
  }

  update(id: number, event: Partial<CreateEventRequest>): Observable<Event> {
    console.log('🔄 EventService - Updating event:', id, event);
    return this.apiClient.put<Event>(API_ENDPOINTS.EVENTS.BY_ID(id), event).pipe(
      tap(updatedEvent => {
        this._events.update(events => events.map(e => (e.id === id ? updatedEvent : e)));
        console.log('✅ Event updated via API:', updatedEvent);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating event update:', error.message);
        const existingEvent = this._events().find(e => e.id === id);
        const mockEvent: Event = { ...existingEvent, ...event, id } as Event;
        this._events.update(events => events.map(e => (e.id === id ? mockEvent : e)));
        return of(mockEvent).pipe(delay(500));
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 EventService - Deleting event:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.EVENTS.BY_ID(id)).pipe(
      tap(() => {
        this._events.update(events => events.filter(e => e.id !== id));
        console.log('✅ Event deleted via API:', id);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating event deletion:', error.message);
        this._events.update(events => events.filter(e => e.id !== id));
        return of({ message: 'Evento eliminado exitosamente (simulado)' }).pipe(delay(500));
      }),
    );
  }

  // Gestión de asistencias
  getAttendances(): Observable<EventAttendance[]> {
    console.log('🔄 EventService - Getting attendances from API');
    return this.apiClient.get<EventAttendance[]>(API_ENDPOINTS.EVENTS.ATTENDANCES).pipe(
      tap(attendances => {
        console.log('✅ Attendances loaded from API:', attendances.length);
        this._attendances.set(attendances);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, using mock attendances:', error.message);
        this._attendances.set(this.mockAttendances);
        return of(this.mockAttendances).pipe(delay(300));
      }),
    );
  }

  registerAttendance(eventId: number, userId: number): Observable<EventAttendance> {
    console.log('🔄 EventService - Registering attendance:', { eventId, userId });
    const attendanceData = {
      evento_id: eventId,
      usuario_id: userId,
    };

    return this.apiClient
      .post<EventAttendance>(API_ENDPOINTS.EVENTS.ATTENDANCES, attendanceData)
      .pipe(
        tap(attendance => {
          this._attendances.update(attendances => [...attendances, attendance]);
          console.log('✅ Attendance registered via API:', attendance);
        }),
        catchError(error => {
          console.warn('⚠️ API unavailable, simulating attendance registration:', error.message);
          const mockAttendance: EventAttendance = {
            id: Math.max(...this.mockAttendances.map(a => a.id)) + Math.floor(Math.random() * 1000),
            evento_id: eventId,
            usuario_id: userId,
            registrado_en: new Date().toISOString(),
          };
          this._attendances.update(attendances => [...attendances, mockAttendance]);
          return of(mockAttendance).pipe(delay(500));
        }),
      );
  }
}
