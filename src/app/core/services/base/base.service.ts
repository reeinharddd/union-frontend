// src/app/core/services/base/base.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { AppState, AppError } from '../../state/app.state';
import { ToastService } from '../ui/toast.service';

@Injectable()
export abstract class BaseService {
  protected readonly apiClient = inject(ApiClientService);
  protected readonly appState = inject(AppState);
  protected readonly toastService = inject(ToastService);

  protected abstract readonly serviceName: string;

  protected handleRequest<T>(
    request: Observable<T>,
    loadingKey: string,
    options: {
      showSuccessToast?: boolean;
      successMessage?: string;
      showErrorToast?: boolean;
      logRequest?: boolean;
    } = {}
  ): Observable<T> {
    const {
      showSuccessToast = false,
      successMessage = 'Operación exitosa',
      showErrorToast = true,
      logRequest = false
    } = options;

    if (logRequest) {
      console.log(`🔄 ${this.serviceName} - Iniciando petición: ${loadingKey}`);
    }

    this.appState.setLoading(loadingKey, true);

    return request.pipe(
      tap(response => {
        if (logRequest) {
          console.log(`✅ ${this.serviceName} - Petición exitosa:`, response);
        }
        if (showSuccessToast) {
          this.toastService.showSuccess(successMessage);
        }
      }),
      catchError(error => {
        const appError: AppError = {
          message: this.getErrorMessage(error),
          code: error.status?.toString(),
          details: error.error,
          timestamp: new Date()
        };

        console.error(`❌ ${this.serviceName} - Error:`, error);
        this.appState.addError(appError);

        if (showErrorToast) {
          this.toastService.showError(appError.message);
        }

        return throwError(() => appError);
      }),
      finalize(() => {
        this.appState.setLoading(loadingKey, false);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return 'Datos inválidos. Por favor verifica la información.';
      case 401:
        return 'No autorizado. Por favor inicia sesión.';
      case 403:
        return 'Sin permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Conflicto con los datos existentes.';
      case 422:
        return 'Error de validación en los datos.';
      case 500:
        return 'Error interno del servidor. Intenta más tarde.';
      default:
        return 'Error inesperado. Por favor intenta más tarde.';
    }
  }
}
