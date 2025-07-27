import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const isAuthenticated = tokenService.isAuthenticated();
  console.log('AuthGuard - Is authenticated:', isAuthenticated);

  if (!isAuthenticated) {
    console.log('AuthGuard - Not authenticated, redirecting to login');
    // Limpiar cualquier dato de sesión corrupto
    tokenService.clearSession();
    router.navigate(['/login']);
    return false;
  }

  console.log('AuthGuard - Access granted');
  return true;
};
