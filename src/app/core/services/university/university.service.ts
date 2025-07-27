import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { BaseService } from '../base/base.service';
import {
  CreateUniversityRequest,
  University,
} from '@app/core/models/university/university.interface';

@Injectable({
  providedIn: 'root',
})
export class UniversityService extends BaseService {
  protected readonly serviceName = 'UniversityService';

  // Estado local
  private readonly _universities = signal<University[]>([]);

  readonly universities = this._universities.asReadonly();

  readonly universitiesOptions = computed(() =>
    this._universities().map(uni => ({
      value: uni.id,
      label: uni.nombre,
    })),
  );

  getAll(): Observable<University[]> {
    return this.handleRequest(
      this.apiClient.get<University[]>(API_ENDPOINTS.UNIVERSITIES.BASE),
      'universities.getAll',
      { logRequest: true },
    ).pipe(
      tap(universities => {
        this._universities.set(universities);
        console.log(`🏫 Loaded ${universities.length} universities`);
      }),
    );
  }

  getById(id: number): Observable<University> {
    return this.handleRequest(
      this.apiClient.get<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)),
      `universities.getById.${id}`,
      { logRequest: true },
    );
  }

  create(universityData: CreateUniversityRequest): Observable<University> {
    return this.handleRequest(
      this.apiClient.post<University>(API_ENDPOINTS.UNIVERSITIES.BASE, universityData),
      'universities.create',
      {
        showSuccessToast: true,
        successMessage: 'Universidad creada exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(newUniversity => {
        this._universities.update(universities => [...universities, newUniversity]);
      }),
    );
  }

  update(id: number, universityData: Partial<CreateUniversityRequest>): Observable<University> {
    return this.handleRequest(
      this.apiClient.put<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id), universityData),
      `universities.update.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Universidad actualizada exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedUniversity => {
        this._universities.update(universities =>
          universities.map(uni => (uni.id === id ? updatedUniversity : uni)),
        );
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)),
      `universities.delete.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Universidad eliminada exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._universities.update(universities => universities.filter(uni => uni.id !== id));
      }),
    );
  }
}
