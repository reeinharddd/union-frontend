import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateEventRequest, Event, EventAttendance } from '../../models/event/event.interface';
import { ApiClientService } from '../base/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiClient = inject(ApiClientService);

  private eventsSignal = signal<Event[]>([]);
  readonly events = this.eventsSignal.asReadonly();

  getAll(): Observable<Event[]> {
    return this.apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.BASE)
      .pipe(
        tap(events => this.eventsSignal.set(events))
      );
  }

  getById(id: number): Observable<Event> {
    return this.apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id));
  }

  create(event: CreateEventRequest): Observable<Event> {
    return this.apiClient.post<Event>(API_ENDPOINTS.EVENTS.BASE, event)
      .pipe(
        tap(newEvent => {
          this.eventsSignal.update(events => [...events, newEvent]);
        })
      );
  }

  update(id: number, event: Partial<CreateEventRequest>): Observable<Event> {
    return this.apiClient.put<Event>(API_ENDPOINTS.EVENTS.BY_ID(id), event)
      .pipe(
        tap(updatedEvent => {
          this.eventsSignal.update(events =>
            events.map(e => e.id === id ? updatedEvent : e)
          );
        })
      );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.EVENTS.BY_ID(id))
      .pipe(
        tap(() => {
          this.eventsSignal.update(events =>
            events.filter(e => e.id !== id)
          );
        })
      );
  }

  // Gestión de asistencias
  getAttendances(): Observable<EventAttendance[]> {
    return this.apiClient.get<EventAttendance[]>(API_ENDPOINTS.EVENTS.ATTENDANCES);
  }

  registerAttendance(eventId: number, userId: number): Observable<EventAttendance> {
    return this.apiClient.post<EventAttendance>(API_ENDPOINTS.EVENTS.ATTENDANCES, {
      evento_id: eventId,
      usuario_id: userId
    });
  }
}
