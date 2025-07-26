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

    // Normalizar ambos a string y minúsculas para comparación
    const normalizedUserRole = String(userRole).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    // Permitir acceso si el rol numérico coincide con el nombre lógico
    // Ejemplo: 1 = estudiante, 2 = admin-uni, 3 = admin, 4 = promoter, 5 = estudiante
    const roleMap: Record<string, string[]> = {
      '1': ['estudiante', 'student', 'user'],
      '2': ['admin_uni', 'admin-uni', 'profesor'],
      '3': ['admin'],
      '4': ['promoter'],
      '5': ['estudiante', 'student', 'user'],
    };

    // Si el rol es numérico y su nombre lógico está en allowedRoles, permitir acceso
    const logicalRoles = roleMap[normalizedUserRole] || [];
    const hasLogicalPermission = logicalRoles.some(logical =>
      normalizedAllowedRoles.includes(logical)
    );

    const hasPermission =
      normalizedAllowedRoles.includes(normalizedUserRole) || hasLogicalPermission;

    console.log('Has permission:', hasPermission);

    if (!hasPermission) {
      console.log('Access denied, redirecting to access-denied or login');
      router.navigate(['/login']); // O crear una página de acceso denegado
      return false;
    }

    return true;
  };
};
