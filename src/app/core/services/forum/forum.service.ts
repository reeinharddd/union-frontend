import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Forum {
  id: number;
  nombre: string;
  descripcion?: string;
  creado_en?: string;
}

export interface CreateForumRequest {
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _forums = signal<Forum[]>([]);

  readonly forums = this._forums.asReadonly();

  getAll(): Observable<Forum[]> {
    console.log('🔄 ForumService - Getting all forums from API');
    return this.apiClient.get<Forum[]>(API_ENDPOINTS.FORUMS.BASE).pipe(
      tap(forums => {
        console.log('✅ Forums loaded from API:', forums.length);
        this._forums.set(forums);
      }),
      catchError(error => {
        console.error('❌ Failed to load forums:', error);
        this.toastService.showError('Error al cargar los foros');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<Forum | null> {
    console.log('🔄 ForumService - Getting forum by ID:', id);
    return this.apiClient.get<Forum>(API_ENDPOINTS.FORUMS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load forum:', error);
        this.toastService.showError('Error al cargar el foro');
        return throwError(() => error);
      }),
    );
  }

  create(forum: CreateForumRequest): Observable<Forum> {
    console.log('🔄 ForumService - Creating forum:', forum);
    return this.apiClient.post<Forum>(API_ENDPOINTS.FORUMS.BASE, forum).pipe(
      tap(newForum => {
        this._forums.update(forums => [...forums, newForum]);
        console.log('✅ Forum created via API:', newForum);
        this.toastService.showSuccess('Foro creado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create forum:', error);
        this.toastService.showError('Error al crear el foro');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, forum: Partial<CreateForumRequest>): Observable<Forum> {
    console.log('🔄 ForumService - Updating forum:', id, forum);
    return this.apiClient.put<Forum>(API_ENDPOINTS.FORUMS.BY_ID(id), forum).pipe(
      tap(updatedForum => {
        this._forums.update(forums => forums.map(f => (f.id === id ? updatedForum : f)));
        console.log('✅ Forum updated via API:', updatedForum);
        this.toastService.showSuccess('Foro actualizado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update forum:', error);
        this.toastService.showError('Error al actualizar el foro');
        return throwError(() => error);
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 ForumService - Deleting forum:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.FORUMS.BY_ID(id)).pipe(
      tap(() => {
        this._forums.update(forums => forums.filter(f => f.id !== id));
        console.log('✅ Forum deleted via API:', id);
        this.toastService.showSuccess('Foro eliminado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete forum:', error);
        this.toastService.showError('Error al eliminar el foro');
        return throwError(() => error);
      }),
    );
  }
}
