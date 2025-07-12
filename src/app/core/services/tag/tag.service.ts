import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Tag {
  id: number;
  nombre: string;
  color?: string;
  descripcion?: string;
  creado_en?: string;
}

export interface CreateTagRequest {
  nombre: string;
  color?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _tags = signal<Tag[]>([]);

  readonly tags = this._tags.asReadonly();

  getAll(): Observable<Tag[]> {
    console.log('🔄 TagService - Getting all tags from API');
    return this.apiClient.get<Tag[]>(API_ENDPOINTS.TAGS.BASE).pipe(
      tap(tags => {
        console.log('✅ Tags loaded from API:', tags.length);
        this._tags.set(tags);
      }),
      catchError(error => {
        console.error('❌ Failed to load tags:', error);
        this.toastService.showError('Error al cargar las etiquetas');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<Tag | null> {
    console.log('🔄 TagService - Getting tag by ID:', id);
    return this.apiClient.get<Tag>(API_ENDPOINTS.TAGS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load tag:', error);
        this.toastService.showError('Error al cargar la etiqueta');
        return throwError(() => error);
      }),
    );
  }

  create(tag: CreateTagRequest): Observable<Tag> {
    console.log('🔄 TagService - Creating tag:', tag);
    return this.apiClient.post<Tag>(API_ENDPOINTS.TAGS.BASE, tag).pipe(
      tap(newTag => {
        this._tags.update(tags => [...tags, newTag]);
        console.log('✅ Tag created via API:', newTag);
        this.toastService.showSuccess('Etiqueta creada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create tag:', error);
        this.toastService.showError('Error al crear la etiqueta');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, tag: Partial<CreateTagRequest>): Observable<Tag> {
    console.log('🔄 TagService - Updating tag:', id, tag);
    return this.apiClient.put<Tag>(API_ENDPOINTS.TAGS.BY_ID(id), tag).pipe(
      tap(updatedTag => {
        this._tags.update(tags => tags.map(t => (t.id === id ? updatedTag : t)));
        console.log('✅ Tag updated via API:', updatedTag);
        this.toastService.showSuccess('Etiqueta actualizada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update tag:', error);
        this.toastService.showError('Error al actualizar la etiqueta');
        return throwError(() => error);
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 TagService - Deleting tag:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.TAGS.BY_ID(id)).pipe(
      tap(() => {
        this._tags.update(tags => tags.filter(t => t.id !== id));
        console.log('✅ Tag deleted via API:', id);
        this.toastService.showSuccess('Etiqueta eliminada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete tag:', error);
        this.toastService.showError('Error al eliminar la etiqueta');
        return throwError(() => error);
      }),
    );
  }
}
