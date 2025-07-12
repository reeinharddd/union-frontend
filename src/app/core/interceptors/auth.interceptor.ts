import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ToastService } from '@app/core/services/ui/toast.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = tokenService.getToken();

  console.log('🔑 Auth Interceptor - Token:', token ? 'Present' : 'Missing');
  console.log('🔗 Request URL:', req.url);

  // Agregar token si está disponible
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log('✅ Token added to request');
  } else {
    console.log('❌ No token available');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('🚨 HTTP Error intercepted:', error);

      // Manejar errores de autenticación
      if (error.status === 401) {
        console.warn('🔒 Unauthorized access - redirecting to login');
        tokenService.clearAll();
        toastService.showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        router.navigate(['/login']);
      }

      // Manejar otros errores
      if (error.status === 403) {
        toastService.showError('No tienes permisos para realizar esta acción.');
      }

      if (error.status >= 500) {
        toastService.showError('Error del servidor. Intenta nuevamente más tarde.');
      }

      return throwError(() => error);
    }),
  );
};
