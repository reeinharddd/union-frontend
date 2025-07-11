import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);

    // Verificar autenticación primero
    const isAuthenticated = localStorage.getItem('auth_token') !== null;
    if (!isAuthenticated) {
      router.navigate(['/login']);
      return false;
    }

    // Obtener el rol del usuario (esto dependerá de tu implementación)
    // Por ejemplo, podrías guardarlo en localStorage o decodificar un JWT
    const userRole = localStorage.getItem('user_role');

    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirigir a una página de acceso denegado o a la página principal
      router.navigate(['/access-denied']);
      return false;
    }

    return true;
  };
};
