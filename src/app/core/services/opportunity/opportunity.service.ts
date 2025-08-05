import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Opportunity {
  id: number;
  titulo: string;
  descripcion: string;
  opportunity_type_id: number;
  universidad_id: number;
  modality_id: number;
  empresa?: string;
  salario_min?: number;
  salario_max?: number;
  requisitos?: string;
  beneficios?: string;
  fecha_limite: string;
  created_by: number; // ID del usuario que creó la oportunidad
}

export interface CreateOpportunityRequest {
  id: number;
  titulo: string;
  descripcion: string;
  opportunity_type_id: number;
  universidad_id: number;
  modality_id?: number;
  empresa?: string;
  salario_min?: number;
  salario_max?: number;
  requisitos?: string;
  beneficios?: string;
  fecha_limite: string;
  created_by?: number; // ID del usuario que creó la oportunidad
}

@Injectable({
  providedIn: 'root',
})
export class OpportunityService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _opportunities = signal<Opportunity[]>([]);

  readonly opportunities = this._opportunities.asReadonly();
  appState: any;

  getAll(): Observable<Opportunity[]> {
    console.log('🔄 OpportunityService - Getting all opportunities from API');
    return this.apiClient.get<Opportunity[]>(API_ENDPOINTS.OPPORTUNITIES.BASE).pipe(
      tap(opportunities => {
        console.log('✅ Opportunities loaded from API:', opportunities.length);
        this._opportunities.set(opportunities);
      }),
      catchError(error => {
        console.error('❌ Failed to load opportunities:', error);
        this.toastService.showError('Error al cargar las oportunidades');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<Opportunity | null> {
    console.log('🔄 OpportunityService - Getting opportunity by ID:', id);
    return this.apiClient.get<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load opportunity:', error);
        this.toastService.showError('Error al cargar la oportunidad');
        return throwError(() => error);
      }),
    );
  }

  getByPromoter(userId: number): Observable<Opportunity[]> {
    console.log('🔄 OpportunityService - Getting opportunities by promoter');
    return this.apiClient.get<Opportunity[]>(API_ENDPOINTS.OPPORTUNITIES.BY_PROMOTER(userId)).pipe(
      tap(opportunities => {
        console.log(`✅ Loaded ${opportunities.length} opportunities for promoter`);
        this._opportunities.set(opportunities);
      }),
      catchError(error => {
        console.error('❌ Failed to load opportunities by promoter:', error);
        this.toastService.showError('Error al cargar las oportunidades del promotor');
        return throwError(() => error);
      }),
    );
  }

  create(opportunity: CreateOpportunityRequest): Observable<Opportunity> {
    console.log('🔄 OpportunityService - Creating opportunity:', opportunity);
    return this.apiClient.post<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BASE, opportunity).pipe(
      tap(newOpportunity => {
        this._opportunities.update(opportunities => [...opportunities, newOpportunity]);
        console.log('✅ Opportunity created via API:', newOpportunity);
        this.toastService.showSuccess('Oportunidad creada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create opportunity:', error);
        this.toastService.showError('Error al crear la oportunidad');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, opportunity: Partial<CreateOpportunityRequest>): Observable<Opportunity> {
    console.log('🔄 OpportunityService - Updating opportunity:', id, opportunity);
    return this.apiClient
      .put<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.UPDATE(id), opportunity)
      .pipe(
        tap(updatedOpportunity => {
          this._opportunities.update(opportunities =>
            opportunities.map(o => (o.id === id ? updatedOpportunity : o)),
          );
          console.log('✅ Opportunity updated via API:', updatedOpportunity);
          this.toastService.showSuccess('Oportunidad actualizada exitosamente');
        }),
        catchError(error => {
          console.error('❌ Failed to update opportunity:', error);
          this.toastService.showError('Error al actualizar la oportunidad');
          return throwError(() => error);
        }),
      );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 OpportunityService - Deleting opportunity:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.OPPORTUNITIES.DELETE(id)).pipe(
      tap(() => {
        this._opportunities.update(opportunities => opportunities.filter(o => o.id !== id));
        console.log('✅ Opportunity deleted via API:', id);
        this.toastService.showSuccess('Oportunidad eliminada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete opportunity:', error);
        this.toastService.showError('Error al eliminar la oportunidad');
        return throwError(() => error);
      }),
    );
  }
  getRecent(limit = 5): Observable<Opportunity[]> {
    console.log('🔄 OpportunityService - Getting recent opportunities');
    return this.apiClient
      .get<Opportunity[]>(`${API_ENDPOINTS.OPPORTUNITIES.BASE}?limit=${limit}`)
      .pipe(
        tap(opportunities => {
          console.log(`✅ Loaded ${opportunities.length} recent opportunities`);
          this._opportunities.set(opportunities);
        }),
        catchError(error => {
          console.error('❌ Failed to load recent opportunities:', error);
          this.toastService.showError('Error al cargar las oportunidades recientes');
          return throwError(() => error);
        }),
      );
  }

  getByUniversity(universityId: number): Observable<Opportunity[]> {
    console.log('🔄 OpportunityService - Getting opportunities by university ID:', universityId);
    return this.apiClient
      .get<Opportunity[]>(`${API_ENDPOINTS.OPPORTUNITIES.BASE}?universidad_id=${universityId}`)
      .pipe(
        tap(opportunities => {
          console.log(
            `✅ Loaded ${opportunities.length} opportunities for university ID ${universityId}`,
          );
          this._opportunities.set(opportunities);
        }),
        catchError(error => {
          console.error('❌ Failed to load opportunities by university:', error);
          this.toastService.showError('Error al cargar las oportunidades de la universidad');
          return throwError(() => error);
        }),
      );
  }

  getByType(type: string): Observable<Opportunity[]> {
    console.log('🔄 OpportunityService - Getting opportunities by type:', type);
    return this.apiClient
      .get<Opportunity[]>(`${API_ENDPOINTS.OPPORTUNITIES.BASE}?tipo=${type}`)
      .pipe(
        tap(opportunities => {
          console.log(`✅ Loaded ${opportunities.length} opportunities of type ${type}`);
          this._opportunities.set(opportunities);
        }),
        catchError(error => {
          console.error('❌ Failed to load opportunities by type:', error);
          this.toastService.showError('Error al cargar las oportunidades por tipo');
          return throwError(() => error);
        }),
      );
  }
  getByUniversityAndType(universityId: number, type: string): Observable<Opportunity[]> {
    console.log(
      '🔄 OpportunityService - Getting opportunities by university ID and type:',
      universityId,
      type,
    );
    return this.apiClient
      .get<
        Opportunity[]
      >(`${API_ENDPOINTS.OPPORTUNITIES.BASE}?universidad_id=${universityId}&tipo=${type}`)
      .pipe(
        tap(opportunities => {
          console.log(
            `✅ Loaded ${opportunities.length} opportunities for university ID ${universityId} and type ${type}`,
          );
          this._opportunities.set(opportunities);
        }),
        catchError(error => {
          console.error('❌ Failed to load opportunities by university and type:', error);
          this.toastService.showError('Error al cargar las oportunidades por universidad y tipo');
          return throwError(() => error);
        }),
      );
  }
}
