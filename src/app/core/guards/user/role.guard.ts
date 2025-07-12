import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const tokenService = inject(TokenService);

    console.log('RoleGuard - Checking access...');

    // Verificar autenticación primero
    const isAuthenticated = tokenService.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.navigate(['/login']);
      return false;
    }

    // Obtener el rol del usuario
    const userRole = tokenService.getUserRole();
    console.log('User role:', userRole);
    console.log('Allowed roles:', allowedRoles);

    if (!userRole) {
      console.log('No user role found, redirecting to login');
      router.navigate(['/login']);
      return false;
    }

    // Verificar si el rol está permitido (hacer la comparación insensible a mayúsculas)
    const normalizedUserRole = userRole.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    const hasPermission = normalizedAllowedRoles.includes(normalizedUserRole);
    console.log('Has permission:', hasPermission);

    if (!hasPermission) {
      console.log('Access denied, redirecting to access-denied or login');
      router.navigate(['/login']); // O crear una página de acceso denegado
      return false;
    }

    return true;
  };
};
