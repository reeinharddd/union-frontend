import { computed, Injectable, signal } from '@angular/core';
import { User } from '@app/core/models/auth/auth.interface';
import { UpdateUserRequest } from '@app/core/models/user/user.interface';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected readonly serviceName = 'UserService';

  // Estado local
  private readonly _users = signal<User[]>([]);

  readonly users = this._users.asReadonly();

  readonly activeUsers = computed(() => this._users().filter(user => user.is_active));

  getAll(): Observable<User[]> {
    return this.handleRequest(
      this.apiClient.get<User[]>(API_ENDPOINTS.USERS.BASE),
      'users.getAll',
      { logRequest: true },
    ).pipe(
      tap(users => {
        this._users.set(users);
        console.log(`📊 Loaded ${users.length} users`);
      }),
    );
  }

  getById(id: number): Observable<User> {
    return this.handleRequest(
      this.apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id)),
      `users.getById.${id}`,
      { logRequest: true },
    );
  }

  update(id: number, data: UpdateUserRequest): Observable<User> {
    return this.handleRequest(
      this.apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data),
      `users.update.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Usuario actualizado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedUser => {
        this._users.update(users =>
          users.map(user => (user.id === id ? { ...user, ...updatedUser } : user)),
        );
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.BY_ID(id)),
      `users.delete.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Usuario desactivado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._users.update(users =>
          users.map(user => (user.id === id ? { ...user, is_active: false } : user)),
        );
      }),
    );
  }

  getUserStats(): { total: number; active: number; byRole: Record<number, number> } {
    const users = this._users();
    const active = users.filter(u => u.is_active).length;
    const byRole = users.reduce(
      (acc, user) => {
        // Verificar que el usuario y rol_id existan antes de usar
        if (user && user.rol_id !== null && user.rol_id !== undefined) {
          acc[user.rol_id] = (acc[user.rol_id] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    return {
      total: users.length,
      active,
      byRole,
    };
  }
}
