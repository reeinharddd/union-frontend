import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';

export const roleGuard = (allowedRoles: number[]): CanActivateFn => {
  return () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const isAuthenticated = tokenService.isAuthenticated();
    console.log('RoleGuard - Is authenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('RoleGuard - Not authenticated, redirecting to login');
      tokenService.clearSession();
      router.navigate(['/login']);
      return false;
    }

    const userRoleId = tokenService.getUserRoleId();
    console.log('RoleGuard - User role:', userRoleId, 'Allowed roles:', allowedRoles);

    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      console.log('RoleGuard - Access denied, insufficient permissions');
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('RoleGuard - Access granted');
    return true;
  };
};

// Convenience functions para roles específicos
export const adminGuard: CanActivateFn = roleGuard([1]); // Admin = 1
export const studentGuard: CanActivateFn = roleGuard([2]); // Estudiante = 2
export const professorGuard: CanActivateFn = roleGuard([3]); // Profesor = 3
export const adminUniGuard: CanActivateFn = roleGuard([9]); // Admin Uni = 9

// Guards combinados
export const adminOrAdminUniGuard: CanActivateFn = roleGuard([1, 9]); // Admin o Admin Uni
export const allRolesGuard: CanActivateFn = roleGuard([1, 2, 3, 9]); // Todos los roles
export const teachingRolesGuard: CanActivateFn = roleGuard([1, 3, 9]); // Admin, Profesor, Admin Uni
