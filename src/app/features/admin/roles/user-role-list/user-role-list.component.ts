import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

interface UserRole {
  id: number;
  usuario_nombre?: string;
  usuario_email?: string;
  rol_nombre: string;
  universidad_nombre?: string;
  estado?: string;
  asignado_en?: string;
  permisos_especiales?: boolean;
}

@Component({
  selector: 'app-user-role-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-role-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoleListComponent {
  private router = inject(Router);

  // TODO: Replace with actual service when available
  userRoles$: Observable<UserRole[]> = of([]);

  getAdminCount(userRoles: UserRole[]): number {
    if (!userRoles) return 0;
    return userRoles.filter(ur => ur.rol_nombre?.toLowerCase().includes('admin')).length;
  }

  getPromoterCount(userRoles: UserRole[]): number {
    if (!userRoles) return 0;
    return userRoles.filter(
      ur =>
        ur.rol_nombre?.toLowerCase().includes('promoter') ||
        ur.rol_nombre?.toLowerCase().includes('promotor'),
    ).length;
  }

  getStudentCount(userRoles: UserRole[]): number {
    if (!userRoles) return 0;
    return userRoles.filter(
      ur =>
        ur.rol_nombre?.toLowerCase().includes('student') ||
        ur.rol_nombre?.toLowerCase().includes('estudiante'),
    ).length;
  }

  getRoleClasses(roleName: string): string {
    switch (roleName?.toLowerCase()) {
      case 'admin':
      case 'administrador':
        return 'bg-red-100 text-red-800';
      case 'promoter':
      case 'promotor':
        return 'bg-green-100 text-green-800';
      case 'student':
      case 'estudiante':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClasses(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  trackByUserRole(index: number, userRole: UserRole): number {
    return userRole.id || index;
  }

  editUserRole(userRole: UserRole): void {
    this.router.navigate(['/admin/roles/user', userRole.id, 'edit']);
  }

  viewPermissions(userRole: UserRole): void {
    this.router.navigate(['/admin/roles/user', userRole.id, 'permissions']);
  }

  suspendUserRole(_userRole: UserRole): void {
    if (confirm('¿Seguro que deseas suspender este rol de usuario?')) {
      // TODO: Implement suspend logic with actual service
    }
  }

  removeUserRole(_userRole: UserRole): void {
    if (confirm('¿Seguro que deseas remover este rol de usuario?')) {
      // TODO: Implement remove logic with actual service
    }
  }
}
