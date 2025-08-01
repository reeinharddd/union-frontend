import { computed, Injectable, signal } from '@angular/core';
import { User, UsersFilters, UsersResponse } from '@app/core/models/auth/auth.interface';
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
  private readonly _totalUsers = signal(0);

  readonly users = this._users.asReadonly();
  readonly totalUsers = this._totalUsers.asReadonly();

  readonly activeUsers = computed(() => this._users().filter(user => user.is_active));

  getAll(filters: UsersFilters = {}): Observable<UsersResponse> {
    return this.handleRequest(
      this.apiClient.get<UsersResponse>(API_ENDPOINTS.USERS.BASE, filters),
      'users.getAll',
      { logRequest: true },
    ).pipe(
      tap(response => {
        this._users.set(response.data);
        this._totalUsers.set(response.pagination.total);
        console.log(`📊 Loaded ${response.data.length} users`);
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
        acc[user.rol_id] = (acc[user.rol_id] || 0) + 1;
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
