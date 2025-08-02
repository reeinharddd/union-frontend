import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface OpportunityType {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string; // URL del ícono
  is_active: boolean; // Indica si el tipo de oportunidad está activo
  created_at?: string; // Fecha de creación
}

@Injectable({
  providedIn: 'root',
})
export class OpportunityTypeService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _opportunityTypes = signal<OpportunityType[]>([]);

  readonly opportunityTypes = this._opportunityTypes.asReadonly();

  getAll(): Observable<OpportunityType[]> {
    console.log('🔄 OpportunityTypeService - Getting all opportunity types from API');
    return this.apiClient.get<OpportunityType[]>(API_ENDPOINTS.OPPORTUNITIES_TYPE.BASE).pipe(
      tap(opportunityTypes => {
        console.log('✅ Opportunity types loaded from API:', opportunityTypes.length);
        this._opportunityTypes.set(opportunityTypes);
      }),
      catchError(error => {
        console.error('❌ Failed to load opportunity types:', error);
        this.toastService.showError('Error al cargar los tipos de oportunidades');
        return throwError(() => error);
      }),
    );
  }
}
