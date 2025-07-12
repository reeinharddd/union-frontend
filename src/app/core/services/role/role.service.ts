import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface UserRole {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: string[];
  creado_en?: string;
}

export interface ProjectRole {
  id: number;
  nombre: string;
  puede_editar: boolean;
  puede_comentar: boolean;
  puede_subir_archivos: boolean;
  puede_validar: boolean;
  creado_en?: string;
}

export interface CreateUserRoleRequest {
  nombre: string;
  descripcion?: string;
  permisos?: string[];
}

export interface CreateProjectRoleRequest {
  nombre: string;
  puede_editar: boolean;
  puede_comentar: boolean;
  puede_subir_archivos: boolean;
  puede_validar: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _userRoles = signal<UserRole[]>([]);
  private readonly _projectRoles = signal<ProjectRole[]>([]);

  readonly userRoles = this._userRoles.asReadonly();
  readonly projectRoles = this._projectRoles.asReadonly();

  // User Roles
  getAllUserRoles(): Observable<UserRole[]> {
    console.log('🔄 RoleService - Getting all user roles from API');
    return this.apiClient.get<UserRole[]>(API_ENDPOINTS.USER_ROLES.BASE).pipe(
      tap(roles => {
        console.log('✅ User roles loaded from API:', roles.length);
        this._userRoles.set(roles);
      }),
      catchError(error => {
        console.error('❌ Failed to load user roles:', error);
        this.toastService.showError('Error al cargar los roles de usuario');
        return throwError(() => error);
      }),
    );
  }

  getUserRoleById(id: number): Observable<UserRole | null> {
    console.log('🔄 RoleService - Getting user role by ID:', id);
    return this.apiClient.get<UserRole>(API_ENDPOINTS.USER_ROLES.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load user role:', error);
        this.toastService.showError('Error al cargar el rol de usuario');
        return throwError(() => error);
      }),
    );
  }

  createUserRole(role: CreateUserRoleRequest): Observable<UserRole> {
    console.log('🔄 RoleService - Creating user role:', role);
    return this.apiClient.post<UserRole>(API_ENDPOINTS.USER_ROLES.BASE, role).pipe(
      tap(newRole => {
        this._userRoles.update(roles => [...roles, newRole]);
        console.log('✅ User role created via API:', newRole);
        this.toastService.showSuccess('Rol de usuario creado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create user role:', error);
        this.toastService.showError('Error al crear el rol de usuario');
        return throwError(() => error);
      }),
    );
  }

  updateUserRole(id: number, role: Partial<CreateUserRoleRequest>): Observable<UserRole> {
    console.log('🔄 RoleService - Updating user role:', id, role);
    return this.apiClient.put<UserRole>(API_ENDPOINTS.USER_ROLES.BY_ID(id), role).pipe(
      tap(updatedRole => {
        this._userRoles.update(roles => roles.map(r => (r.id === id ? updatedRole : r)));
        console.log('✅ User role updated via API:', updatedRole);
        this.toastService.showSuccess('Rol de usuario actualizado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update user role:', error);
        this.toastService.showError('Error al actualizar el rol de usuario');
        return throwError(() => error);
      }),
    );
  }

  deleteUserRole(id: number): Observable<{ message: string }> {
    console.log('🔄 RoleService - Deleting user role:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.USER_ROLES.BY_ID(id)).pipe(
      tap(() => {
        this._userRoles.update(roles => roles.filter(r => r.id !== id));
        console.log('✅ User role deleted via API:', id);
        this.toastService.showSuccess('Rol de usuario eliminado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete user role:', error);
        this.toastService.showError('Error al eliminar el rol de usuario');
        return throwError(() => error);
      }),
    );
  }

  // Project Roles
  getAllProjectRoles(): Observable<ProjectRole[]> {
    console.log('🔄 RoleService - Getting all project roles from API');
    return this.apiClient.get<ProjectRole[]>(API_ENDPOINTS.PROJECT_ROLES.BASE).pipe(
      tap(roles => {
        console.log('✅ Project roles loaded from API:', roles.length);
        this._projectRoles.set(roles);
      }),
      catchError(error => {
        console.error('❌ Failed to load project roles:', error);
        this.toastService.showError('Error al cargar los roles de proyecto');
        return throwError(() => error);
      }),
    );
  }

  getProjectRoleById(id: number): Observable<ProjectRole | null> {
    console.log('🔄 RoleService - Getting project role by ID:', id);
    return this.apiClient.get<ProjectRole>(API_ENDPOINTS.PROJECT_ROLES.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load project role:', error);
        this.toastService.showError('Error al cargar el rol de proyecto');
        return throwError(() => error);
      }),
    );
  }

  createProjectRole(role: CreateProjectRoleRequest): Observable<ProjectRole> {
    console.log('🔄 RoleService - Creating project role:', role);
    return this.apiClient.post<ProjectRole>(API_ENDPOINTS.PROJECT_ROLES.BASE, role).pipe(
      tap(newRole => {
        this._projectRoles.update(roles => [...roles, newRole]);
        console.log('✅ Project role created via API:', newRole);
        this.toastService.showSuccess('Rol de proyecto creado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create project role:', error);
        this.toastService.showError('Error al crear el rol de proyecto');
        return throwError(() => error);
      }),
    );
  }

  updateProjectRole(id: number, role: Partial<CreateProjectRoleRequest>): Observable<ProjectRole> {
    console.log('🔄 RoleService - Updating project role:', id, role);
    return this.apiClient.put<ProjectRole>(API_ENDPOINTS.PROJECT_ROLES.BY_ID(id), role).pipe(
      tap(updatedRole => {
        this._projectRoles.update(roles => roles.map(r => (r.id === id ? updatedRole : r)));
        console.log('✅ Project role updated via API:', updatedRole);
        this.toastService.showSuccess('Rol de proyecto actualizado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update project role:', error);
        this.toastService.showError('Error al actualizar el rol de proyecto');
        return throwError(() => error);
      }),
    );
  }

  deleteProjectRole(id: number): Observable<{ message: string }> {
    console.log('🔄 RoleService - Deleting project role:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.PROJECT_ROLES.BY_ID(id)).pipe(
      tap(() => {
        this._projectRoles.update(roles => roles.filter(r => r.id !== id));
        console.log('✅ Project role deleted via API:', id);
        this.toastService.showSuccess('Rol de proyecto eliminado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete project role:', error);
        this.toastService.showError('Error al eliminar el rol de proyecto');
        return throwError(() => error);
      }),
    );
  }
}
