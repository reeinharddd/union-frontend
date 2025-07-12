import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@app/core/services/auth/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  console.log('🔑 Auth Interceptor - Token:', token ? 'Present' : 'Missing');
  console.log('🔗 Request URL:', req.url);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log('✅ Token added to request');
    return next(authReq);
  }

  console.log('❌ No token available');
  return next(req);
};
