import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Postulation {
  id: number;
  usuario_id: number;
  oportunidad_id: number;
  mensaje: string;
  estado: string;
  fecha?: string;
}
export interface CreatePostulationRequest {
  usuario_id: number;
  oportunidad_id: number;
  mensaje: string;
  estado?: string; // Opcional, si no se proporciona, se puede establecer un valor por defecto en el backend
}

@Injectable({
  providedIn: 'root',
})
export class PostulationService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _postulations = signal<Postulation[]>([]);

  readonly postulations = this._postulations.asReadonly();
  appState: any;

  getAll(): Observable<Postulation[]> {
    console.log('🔄 PostulationService - Getting all postulations from API');
    return this.apiClient.get<Postulation[]>(API_ENDPOINTS.POSTULATIONS.BASE).pipe(
      tap(postulations => {
        console.log('✅ Postulations loaded from API:', postulations.length);
        this._postulations.set(postulations);
      }),
      catchError(error => {
        console.error('❌ Failed to load postulations:', error);
        this.toastService.showError('Error al cargar las postulaciones');
        return throwError(() => error);
      }),
    );
  }

  create(data: CreatePostulationRequest): Observable<Postulation> {
    console.log('🔄 PostulationService - Creating postulation:', data);
    return this.apiClient.post<Postulation>(API_ENDPOINTS.POSTULATIONS.BASE, data).pipe(
      tap(newPostulation => {
        console.log('✅ Postulation created:', newPostulation);
        this._postulations.update(postulations => [...postulations, newPostulation]);
        this.toastService.showSuccess('Postulación creada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create postulation:', error);
        this.toastService.showError('Error al crear la postulación');
        return throwError(() => error);
      }),
    );
  }
  getById(id: number): Observable<Postulation | null> {
    console.log('🔄 PostulationService - Getting postulation by ID:', id);
    return this.apiClient.get<Postulation>(API_ENDPOINTS.POSTULATIONS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load postulation:', error);
        this.toastService.showError('Error al cargar la postulación');
        return throwError(() => error);
      }),
    );
  }
  update(id: number, data: Partial<Postulation>): Observable<Postulation> {
    console.log('🔄 PostulationService - Updating postulation:', id, data);
    return this.apiClient.put<Postulation>(API_ENDPOINTS.POSTULATIONS.UPDATE(id), data).pipe(
      tap(updatedPostulation => {
        this._postulations.update(postulations =>
          postulations.map(postulation =>
            postulation.id === id ? { ...postulation, ...updatedPostulation } : postulation,
          ),
        );
        console.log('✅ Postulation updated:', updatedPostulation);
        this.toastService.showSuccess('Postulación actualizada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update postulation:', error);
        this.toastService.showError('Error al actualizar la postulación');
        return throwError(() => error);
      }),
    );
  }

  // Otros métodos como delete pueden ser implementados aquí
  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 PostulationService - Deleting postulation:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.POSTULATIONS.BY_ID(id)).pipe(
      tap(() => {
        this._postulations.update(postulations =>
          postulations.filter(postulation => postulation.id !== id),
        );
        console.log('✅ Postulation deleted:', id);
        this.toastService.showSuccess('Postulación eliminada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete postulation:', error);
        this.toastService.showError('Error al eliminar la postulación');
        return throwError(() => error);
      }),
    );
  }
  getRecent(): Observable<Postulation[]> {
    console.log('🔄 PostulationService - Getting recent postulations');
    return this.apiClient.get<Postulation[]>(`${API_ENDPOINTS.POSTULATIONS.BASE}/recent`).pipe(
      tap(postulations => {
        console.log('✅ Recent postulations loaded:', postulations.length);
        this._postulations.set(postulations);
      }),
      catchError(error => {
        console.error('❌ Failed to load recent postulations:', error);
        this.toastService.showError('Error al cargar las postulaciones recientes');
        return throwError(() => error);
      }),
    );
  }

  // Otros métodos como update, delete pueden ser implementados aquí

  // Otros métodos como getById, update, delete pueden ser implementados aquí
}

// Asegúrate de que API_ENDPOINTS.POSTULATIONS.BASE esté definido en tus constantes de API
// Ejemplo: API_ENDPOINTS.POSTULATIONS.BASE = '/postulaciones';
