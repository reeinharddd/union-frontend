import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateUniversityRequest, University } from '../../models/university/university.interface';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _universities = signal<University[]>([]);

  readonly universities = this._universities.asReadonly();

  getAll(): Observable<University[]> {
    console.log('🔄 UniversityService - Getting all universities from API');
    return this.apiClient.get<University[]>(API_ENDPOINTS.UNIVERSITIES.BASE).pipe(
      tap(universities => {
        console.log('✅ Universities loaded from API:', universities.length);
        this._universities.set(universities);
      }),
      catchError(error => {
        console.error('❌ Failed to load universities:', error);
        this.toastService.showError('Error al cargar las universidades');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<University | null> {
    console.log('🔄 UniversityService - Getting university by ID:', id);
    return this.apiClient.get<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load university:', error);
        this.toastService.showError('Error al cargar la universidad');
        return throwError(() => error);
      }),
    );
  }

  create(university: CreateUniversityRequest): Observable<University> {
    console.log('🔄 UniversityService - Creating university:', university);
    return this.apiClient.post<University>(API_ENDPOINTS.UNIVERSITIES.BASE, university).pipe(
      tap(newUniversity => {
        this._universities.update(universities => [...universities, newUniversity]);
        console.log('✅ University created via API:', newUniversity);
        this.toastService.showSuccess('Universidad creada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create university:', error);
        this.toastService.showError('Error al crear la universidad');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, university: Partial<CreateUniversityRequest>): Observable<University> {
    console.log('🔄 UniversityService - Updating university:', id, university);
    return this.apiClient.put<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id), university).pipe(
      tap(updatedUniversity => {
        this._universities.update(universities =>
          universities.map(u => (u.id === id ? updatedUniversity : u)),
        );
        console.log('✅ University updated via API:', updatedUniversity);
        this.toastService.showSuccess('Universidad actualizada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update university:', error);
        this.toastService.showError('Error al actualizar la universidad');
        return throwError(() => error);
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 UniversityService - Deleting university:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)).pipe(
      tap(() => {
        this._universities.update(universities => universities.filter(u => u.id !== id));
        console.log('✅ University deleted via API:', id);
        this.toastService.showSuccess('Universidad eliminada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete university:', error);
        this.toastService.showError('Error al eliminar la universidad');
        return throwError(() => error);
      }),
    );
  }
}
