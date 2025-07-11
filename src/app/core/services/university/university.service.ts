import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateUniversityRequest, University } from '../../models/university/university.interface';
import { ApiClientService } from '../base/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private readonly apiClient = inject(ApiClientService);

  private universitiesSignal = signal<University[]>([]);
  readonly universities = this.universitiesSignal.asReadonly();

  getAll(): Observable<University[]> {
    return this.apiClient.get<University[]>(API_ENDPOINTS.UNIVERSITIES.BASE)
      .pipe(
        tap(universities => this.universitiesSignal.set(universities))
      );
  }

  getById(id: number): Observable<University> {
    return this.apiClient.get<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id));
  }

  create(university: CreateUniversityRequest): Observable<University> {
    return this.apiClient.post<University>(API_ENDPOINTS.UNIVERSITIES.BASE, university)
      .pipe(
        tap(newUniversity => {
          this.universitiesSignal.update(universities => [...universities, newUniversity]);
        })
      );
  }

  update(id: number, university: Partial<CreateUniversityRequest>): Observable<University> {
    return this.apiClient.put<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id), university)
      .pipe(
        tap(updatedUniversity => {
          this.universitiesSignal.update(universities =>
            universities.map(u => u.id === id ? updatedUniversity : u)
          );
        })
      );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id))
      .pipe(
        tap(() => {
          this.universitiesSignal.update(universities =>
            universities.filter(u => u.id !== id)
          );
        })
      );
  }
}
