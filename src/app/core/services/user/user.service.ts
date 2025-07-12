import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface User {
  id: number;
  name?: string;
  email: string;
  role: string;
  telefono?: string;
  universidad_id?: number;
  biografia?: string;
  creado_en?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _users = signal<User[]>([]);

  readonly users = this._users.asReadonly();

  getAll(): Observable<User[]> {
    console.log('🔄 UserService - Getting all users from API');
    return this.apiClient.get<User[]>(API_ENDPOINTS.USERS.BASE).pipe(
      tap(users => {
        console.log('✅ Users loaded from API:', users.length);
        this._users.set(users);
      }),
      catchError(error => {
        console.error('❌ Failed to load users:', error);
        this.toastService.showError('Error al cargar los usuarios');
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<User | null> {
    console.log('🔄 UserService - Getting user by ID:', id);
    return this.apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load user:', error);
        this.toastService.showError('Error al cargar el usuario');
        return throwError(() => error);
      }),
    );
  }

  create(userData: Partial<User>): Observable<User> {
    console.log('🔄 UserService - Creating user:', userData);
    return this.apiClient.post<User>(API_ENDPOINTS.USERS.BASE, userData).pipe(
      tap(newUser => {
        this._users.update(users => [...users, newUser]);
        console.log('✅ User created via API:', newUser);
        this.toastService.showSuccess('Usuario creado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create user:', error);
        this.toastService.showError('Error al crear el usuario');
        return throwError(() => error);
      }),
    );
  }

  update(id: number, userData: Partial<User>): Observable<User> {
    console.log('🔄 UserService - Updating user:', id, userData);
    return this.apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), userData).pipe(
      tap(updatedUser => {
        this._users.update(users => users.map(user => (user.id === id ? updatedUser : user)));
        console.log('✅ User updated via API:', updatedUser);
        this.toastService.showSuccess('Usuario actualizado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to update user:', error);
        this.toastService.showError('Error al actualizar el usuario');
        return throwError(() => error);
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 UserService - Deleting user:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.BY_ID(id)).pipe(
      tap(() => {
        this._users.update(users => users.filter(user => user.id !== id));
        console.log('✅ User deleted via API:', id);
        this.toastService.showSuccess('Usuario eliminado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to delete user:', error);
        this.toastService.showError('Error al eliminar el usuario');
        return throwError(() => error);
      }),
    );
  }

  // Método para debugging de estado
  debugState(): void {
    console.log('🔍 UserService Debug State:');
    console.log('- Current users count:', this._users().length);
    console.log('- Users:', this._users());
  }
}
