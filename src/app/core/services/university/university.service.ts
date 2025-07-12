import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { CreateUniversityRequest, University } from '../../models/university/university.interface';
import { ApiClientService } from '../base/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private readonly apiClient = inject(ApiClientService);
  private readonly _universities = signal<University[]>([]);

  readonly universities = this._universities.asReadonly();

  // Datos mock para fallback
  private readonly mockUniversities: University[] = [
    {
      id: 1,
      nombre: 'Universidad Nacional de Colombia',
      dominio_correo: 'unal.edu.co',
      logo_url: 'https://unal.edu.co/fileadmin/user_upload/logos/logo_unal.png',
    },
    {
      id: 2,
      nombre: 'Pontificia Universidad Javeriana',
      dominio_correo: 'javeriana.edu.co',
      logo_url: 'https://www.javeriana.edu.co/img/logo.png',
    },
    {
      id: 3,
      nombre: 'Universidad de los Andes',
      dominio_correo: 'uniandes.edu.co',
      logo_url: 'https://uniandes.edu.co/sites/default/files/logo-uniandes.png',
    },
    {
      id: 4,
      nombre: 'Universidad del Norte',
      dominio_correo: 'uninorte.edu.co',
      logo_url: 'https://www.uninorte.edu.co/img/logo.png',
    },
    {
      id: 5,
      nombre: 'Universidad ICESI',
      dominio_correo: 'icesi.edu.co',
      logo_url: 'https://www.icesi.edu.co/img/logo.png',
    },
  ];

  getAll(): Observable<University[]> {
    console.log('🔄 UniversityService - Getting all universities from API');
    return this.apiClient.get<University[]>(API_ENDPOINTS.UNIVERSITIES.BASE).pipe(
      tap(universities => {
        console.log('✅ Universities loaded from API:', universities.length);
        this._universities.set(universities);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, using mock universities:', error.message);
        this._universities.set(this.mockUniversities);
        return of(this.mockUniversities).pipe(delay(500));
      }),
    );
  }

  getById(id: number): Observable<University | null> {
    console.log('🔄 UniversityService - Getting university by ID:', id);
    return this.apiClient.get<University>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)).pipe(
      catchError(() => {
        console.warn('⚠️ API unavailable, using mock data for university:', id);
        const mockUniversity = this.mockUniversities.find(u => u.id === id) || null;
        return of(mockUniversity).pipe(delay(300));
      }),
    );
  }

  create(university: CreateUniversityRequest): Observable<University> {
    console.log('🔄 UniversityService - Creating university:', university);
    return this.apiClient.post<University>(API_ENDPOINTS.UNIVERSITIES.BASE, university).pipe(
      tap(newUniversity => {
        this._universities.update(universities => [...universities, newUniversity]);
        console.log('✅ University created via API:', newUniversity);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating university creation:', error.message);
        const mockUniversity: University = {
          id: Math.max(...this.mockUniversities.map(u => u.id)) + Math.floor(Math.random() * 1000),
          ...university,
        };
        this._universities.update(universities => [...universities, mockUniversity]);
        return of(mockUniversity).pipe(delay(500));
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
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating university update:', error.message);
        const existingUniversity = this._universities().find(u => u.id === id);
        const mockUniversity: University = {
          ...existingUniversity,
          ...university,
          id,
        } as University;
        this._universities.update(universities =>
          universities.map(u => (u.id === id ? mockUniversity : u)),
        );
        return of(mockUniversity).pipe(delay(500));
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 UniversityService - Deleting university:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.UNIVERSITIES.BY_ID(id)).pipe(
      tap(() => {
        this._universities.update(universities => universities.filter(u => u.id !== id));
        console.log('✅ University deleted via API:', id);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating university deletion:', error.message);
        this._universities.update(universities => universities.filter(u => u.id !== id));
        return of({ message: 'Universidad eliminada exitosamente (simulado)' }).pipe(delay(500));
      }),
    );
  }
}
