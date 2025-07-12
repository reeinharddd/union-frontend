import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Opportunity {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  fecha_limite: string;
  creado_en?: string;
}

export interface CreateOpportunityRequest {
  titulo: string;
  descripcion: string;
  tipo: string;
  universidad_id: number;
  fecha_limite: string;
}

@Injectable({
  providedIn: 'root',
})
export class OpportunityService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _opportunities = signal<Opportunity[]>([]);

  readonly opportunities = this._opportunities.asReadonly();

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
    return this.apiClient.put<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id), opportunity).pipe(
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
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id)).pipe(
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
}
