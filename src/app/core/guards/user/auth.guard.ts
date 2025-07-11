import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Aquí implementa tu lógica de autenticación
  // Por ejemplo, verificar si hay un token en localStorage
  const isAuthenticated = localStorage.getItem('auth_token') !== null;

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
