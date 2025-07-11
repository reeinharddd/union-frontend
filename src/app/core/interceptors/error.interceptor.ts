import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/ui/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      }

      switch (error.status) {
        case 401:
          router.navigate(['/login']);
          toastService.showError('Sesión expirada. Por favor inicia sesión nuevamente.');
          break;
        case 403:
          toastService.showError('No tienes permisos para realizar esta acción.');
          break;
        case 404:
          toastService.showError('Recurso no encontrado.');
          break;
        case 409:
          toastService.showError(errorMessage);
          break;
        case 500:
          toastService.showError('Error interno del servidor. Intenta más tarde.');
          break;
        default:
          toastService.showError(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
