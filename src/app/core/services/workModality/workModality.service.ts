import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface workModality {
  id: number;
  name: string;
  description?: string;
  is_active: boolean; // Indica si la modalidad de trabajo está activa
}
@Injectable({
  providedIn: 'root',
})
export class WorkModalityService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _workModalities = signal<workModality[]>([]);

  readonly workModalities = this._workModalities.asReadonly();

  getAll(): Observable<workModality[]> {
    console.log('🔄 WorkModalityService - Getting all work modalities from API');
    return this.apiClient.get<workModality[]>(API_ENDPOINTS.WORK_MODALITIES.BASE).pipe(
      tap(workModalities => {
        console.log('✅ Work modalities loaded from API:', workModalities.length);
        this._workModalities.set(workModalities);
      }),
      catchError(error => {
        console.error('❌ Failed to load work modalities:', error);
        this.toastService.showError('Error al cargar las modalidades de trabajo');
        return throwError(() => error);
      }),
    );
  }
}
