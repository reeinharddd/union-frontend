import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateEventRequest, Event, EventAttendance } from '../../models/event/event.interface';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _events = signal<Event[]>([]);
  private readonly _attendances = signal<EventAttendance[]>([]);

  readonly events = this._events.asReadonly();

  getAll(): Observable<Event[]> {
    console.log('🔄 EventService - Getting all events from API');
    return this.apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.BASE).pipe(
      tap(events => {
        console.log('✅ Events loaded from API:', events.length);
        this._events.set(events);
      }),
      catchError(error => {
        console.error('❌ Failed to load events:', error);
        this.toastService.showError('Error al cargar los eventos');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<Event | null> {
    console.log('🔄 EventService - Getting event by ID:', id);
    return this.apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load event:', error);
        this.toastService.showError('Error al cargar el evento');
        return throwError(() => error);
      }),
    );
  }

  create(event: CreateEventRequest): Observable<Event> {
    console.log('🔄 EventService - Creating event:', event);
    return this.apiClient.post<Event>(API_ENDPOINTS.EVENTS.BASE, event).pipe(
      tap(newEvent => {
        this._events.update(events => [...events, newEvent]);
        console.log('✅ Event created via API:', newEvent);
        this.toastService.showSuccess('Evento creado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create event:', error);
        this.toastService.showError('Error al crear el evento');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, event: Partial<CreateEventRequest>): Observable<Event> {
    console.log('🔄 EventService - Updating event:', id, event);
    return this.apiClient.put<Event>(API_ENDPOINTS.EVENTS.BY_ID(id), event).pipe(
      tap(updatedEvent => {
        this._events.update(events => events.map(e => (e.id === id ? updatedEvent : e)));
        console.log('✅ Event updated via API:', updatedEvent);
        this.toastService.showSuccess('Evento actualizado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update event:', error);
        this.toastService.showError('Error al actualizar el evento');
        return throwError(() => error);
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 EventService - Deleting event:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.EVENTS.BY_ID(id)).pipe(
      tap(() => {
        this._events.update(events => events.filter(e => e.id !== id));
        console.log('✅ Event deleted via API:', id);
        this.toastService.showSuccess('Evento eliminado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete event:', error);
        this.toastService.showError('Error al eliminar el evento');
        return throwError(() => error);
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
        console.error('❌ Failed to load attendances:', error);
        this.toastService.showError('Error al cargar las asistencias');
        return throwError(() => error);
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
          this.toastService.showSuccess('Asistencia registrada exitosamente');
        }),
        catchError(error => {
          console.error('❌ Failed to register attendance:', error);
          this.toastService.showError('Error al registrar la asistencia');
          return throwError(() => error);
        }),
      );
  }
}
