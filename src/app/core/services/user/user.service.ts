import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';

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
  providedIn: 'root'
})
export class UserService {
  private readonly apiClient = inject(ApiClientService);
  private readonly _users = signal<User[]>([]);

  readonly users = this._users.asReadonly();

  // Datos mock para fallback
  private readonly mockUsers: User[] = [
    {
      id: 1,
      name: 'Ana García',
      email: 'ana@unal.edu.co',
      role: 'admin',
      universidad_id: 1,
      telefono: '+57 300 123 4567',
      creado_en: '2024-01-15T10:00:00Z',
      biografia: 'Administradora del sistema',
      address: 'Carrera 30 #45-03, Bogotá'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos@javeriana.edu.co',
      role: 'user',
      universidad_id: 2,
      telefono: '+57 310 987 6543',
      creado_en: '2024-02-20T14:30:00Z',
      biografia: 'Estudiante de ingeniería',
      address: 'Calle 40 #13-09, Bogotá'
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria@andes.edu.co',
      role: 'promoter',
      universidad_id: 3,
      telefono: '+57 320 456 7890',
      creado_en: '2024-03-10T09:15:00Z',
      biografia: 'Promotora de eventos',
      address: 'Carrera 1 #18A-12, Bogotá'
    },
    {
      id: 4,
      name: 'Diego Martínez',
      email: 'diego@uninorte.edu.co',
      role: 'admin_uni',
      universidad_id: 4,
      telefono: '+57 315 234 5678',
      creado_en: '2024-03-25T16:45:00Z',
      biografia: 'Admin universitario',
      address: 'Km 5 Vía Puerto Colombia, Barranquilla'
    },
    {
      id: 5,
      name: 'Laura Sánchez',
      email: 'laura@icesi.edu.co',
      role: 'user',
      universidad_id: 5,
      telefono: '+57 318 765 4321',
      creado_en: '2024-04-05T11:20:00Z',
      biografia: 'Estudiante de diseño',
      address: 'Calle 18 #122-135, Cali'
    }
  ];

  getAll(): Observable<User[]> {
    console.log('🔄 UserService - Getting all users from API');
    return this.apiClient.get<User[]>(API_ENDPOINTS.USERS.BASE).pipe(
      tap(users => {
        console.log('✅ Users loaded from API:', users.length);
        this._users.set(users);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, using mock data:', error.message);
        // Fallback a datos mock con delay para simular red
        this._users.set(this.mockUsers);
        return of(this.mockUsers).pipe(delay(500));
      })
    );
  }

  getById(id: number): Observable<User | null> {
    console.log('🔄 UserService - Getting user by ID:', id);
    return this.apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id)).pipe(
      catchError(() => {
        console.warn('⚠️ API unavailable, using mock data for user:', id);
        const mockUser = this.mockUsers.find(u => u.id === id) || null;
        return of(mockUser).pipe(delay(300));
      })
    );
  }

  create(userData: Partial<User>): Observable<User> {
    console.log('🔄 UserService - Creating user:', userData);
    return this.apiClient.post<User>(API_ENDPOINTS.USERS.BASE, userData).pipe(
      tap(newUser => {
        this._users.update(users => [...users, newUser]);
        console.log('✅ User created via API:', newUser);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating user creation:', error.message);
        // Simular éxito para desarrollo
        const mockUser: User = {
          id: Math.max(...this.mockUsers.map(u => u.id)) + Math.floor(Math.random() * 1000),
          email: userData.email || '',
          name: userData.name || 'Usuario Mock',
          role: userData.role || 'user',
          telefono: userData.telefono,
          universidad_id: userData.universidad_id,
          biografia: userData.biografia,
          address: userData.address,
          creado_en: new Date().toISOString()
        };
        this._users.update(users => [...users, mockUser]);
        return of(mockUser).pipe(delay(500));
      })
    );
  }

  update(id: number, userData: Partial<User>): Observable<User> {
    console.log('🔄 UserService - Updating user:', id, userData);
    return this.apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), userData).pipe(
      tap(updatedUser => {
        this._users.update(users =>
          users.map(user => user.id === id ? updatedUser : user)
        );
        console.log('✅ User updated via API:', updatedUser);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating user update:', error.message);
        // Simular éxito
        const existingUser = this._users().find(u => u.id === id);
        const mockUser: User = { ...existingUser, ...userData, id } as User;
        this._users.update(users =>
          users.map(user => user.id === id ? mockUser : user)
        );
        return of(mockUser).pipe(delay(500));
      })
    );
  }

  delete(id: number): Observable<{ message: string }> {
    console.log('🔄 UserService - Deleting user:', id);
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.BY_ID(id)).pipe(
      tap(() => {
        this._users.update(users => users.filter(user => user.id !== id));
        console.log('✅ User deleted via API:', id);
      }),
      catchError(error => {
        console.warn('⚠️ API unavailable, simulating user deletion:', error.message);
        // Simular éxito
        this._users.update(users => users.filter(user => user.id !== id));
        return of({ message: 'Usuario eliminado exitosamente (simulado)' }).pipe(delay(500));
      })
    );
  }

  // Método para debugging de estado
  debugState(): void {
    console.log('🔍 UserService Debug State:');
    console.log('- Current users count:', this._users().length);
    console.log('- Users:', this._users());
  }
}
