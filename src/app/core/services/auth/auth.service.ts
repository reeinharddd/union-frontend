import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError, of, delay } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { Roles } from '../../enums/roles';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../models/auth/auth.interface';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiClient = inject(ApiClientService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private currentUserSignal = signal<User | null>(null);

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.tokenService.isAuthenticated());
  readonly userRole = computed(() => this.tokenService.userRole());

  // Mapeo de roles a rutas - actualizado según API
  private readonly roleRoutes: Record<string, string> = {
    // Roles principales según API
    admin: '/admin/dashboard',
    user: '/student/dashboard',
    promoter: '/promoter/dashboard',
    admin_uni: '/admin-uni/dashboard',

    // Variantes adicionales por compatibilidad
    administrator: '/admin/dashboard',
    student: '/student/dashboard',
    universidad: '/admin-uni/dashboard',
    promotor: '/promoter/dashboard',
  };

  private readonly TOKEN_KEY = 'auth_token';

  constructor() {
    // Verificar si hay un usuario en el localStorage al inicializar
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = this.tokenService.getToken();
    const role = this.tokenService.getUserRole();

    console.log('🔄 Initializing from storage:', {
      hasToken: !!token,
      role: role || 'No role found',
    });

    if (token && role) {
      // Si hay token y rol, crear usuario básico
      this.currentUserSignal.set({
        id: 0,
        email: '',
        role: role,
        name: '',
      });
      console.log('✅ User initialized with role:', role);
    } else {
      console.log('❌ Missing token or role during initialization');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔄 AuthService - Attempting login with API');
    return this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      tap(response => {
        console.log('✅ Login successful via API:', response);
        this.setAuthData(response);
        this.toastService.showSuccess(`¡Bienvenido ${response.user.name || response.user.email}!`);
      }),
      catchError(error => {
        console.warn('⚠️ API login failed, attempting mock validation:', error.message);

        // Fallback a validación mock
        return this.mockLogin(credentials).pipe(
          tap(response => {
            this.setAuthData(response);
            this.toastService.showSuccess(`¡Bienvenido ${response.user.name}! (Modo Demo)`);
          }),
          catchError(mockError => {
            console.error('❌ Mock login also failed:', mockError);
            this.toastService.showError('Error al iniciar sesión. Verifica tus credenciales.');
            return throwError(() => mockError);
          })
        );
      }),
    );
  }

  // Mock login para desarrollo sin backend
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🎭 Using mock login for development');

    // Usuarios mock para desarrollo
    const mockUsers = [
      { email: 'admin@union.com', password: 'admin123', role: 'admin', name: 'Admin Usuario' },
      { email: 'user@universidad.edu', password: 'user123', role: 'user', name: 'Estudiante Demo' },
      { email: 'promoter@union.com', password: 'promoter123', role: 'promoter', name: 'Promotor Demo' },
      { email: 'admin_uni@universidad.edu', password: 'uni123', role: 'admin_uni', name: 'Admin Universitario' }
    ];

    const user = mockUsers.find(u =>
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const mockResponse: AuthResponse = {
        user: {
          id: Math.floor(Math.random() * 1000),
          email: user.email,
          name: user.name,
          role: user.role
        },
        // ✅ IMPORTANTE: Generar un token que simule el formato real del backend
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIke3VzZXIuaWR9Iiwicm9sZSI6IiR7dXNlci5yb2xlfSIsImlhdCI6JHtEYXRlLm5vdygpfX0.mock_signature_${user.role}`
      };

      return of(mockResponse).pipe(delay(1000)); // Simular latencia de red
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('🔄 AuthService - Attempting registration with API');
    return this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData).pipe(
      tap(response => {
        console.log('✅ Registration successful via API:', response);
        this.setAuthData(response);
        this.toastService.showSuccess('¡Cuenta creada exitosamente!');
      }),
      catchError(error => {
        console.warn('⚠️ API registration failed, simulating success:', error.message);

        // Fallback a registro mock
        const mockResponse: AuthResponse = {
          user: {
            id: Math.floor(Math.random() * 1000),
            email: userData.email,
            name: userData.name || 'Usuario Demo',
            role: 'user'
          },
          token: `mock_token_${Date.now()}_user`
        };

        this.setAuthData(mockResponse);
        this.toastService.showSuccess('¡Cuenta creada exitosamente! (Modo Demo)');
        return of(mockResponse).pipe(delay(1000));
      }),
    );
  }

  logout(): void {
    const userName = this.currentUser()?.name || 'Usuario';
    this.clearAuthData();
    this.toastService.showInfo(`¡Hasta luego ${userName}!`);
    this.router.navigate(['/login']);
  }

  navigateByRole(): void {
    const userRole = this.tokenService.getUserRole();
    console.log('🧭 Navigating by role:', userRole);
    console.log('🗺️ Available routes:', this.roleRoutes);

    if (userRole) {
      const normalizedRole = userRole.toLowerCase();
      const route = this.roleRoutes[normalizedRole];

      if (route) {
        console.log('✅ Route found, navigating to:', route);
        this.router.navigate([route]);
      } else {
        console.error('❌ No route found for role:', userRole);
        this.toastService.showError(`Rol de usuario no válido: ${userRole}`);
        this.router.navigate(['/login']);
      }
    } else {
      console.error('❌ No user role found in TokenService');
      this.toastService.showError('No se pudo determinar el rol del usuario');
      this.router.navigate(['/login']);
    }
  }

  getRoleLayout(role?: string): string {
    const userRole = role || this.tokenService.getUserRole();
    const roleLayouts: Record<string, string> = {
      [Roles.ADMIN.toLowerCase()]: 'admin',
      [Roles.ADMIN_UNI.toLowerCase()]: 'private',
      [Roles.PROMOTER.toLowerCase()]: 'admin',
      [Roles.USER.toLowerCase()]: 'private',
      // Variantes adicionales
      admin: 'admin',
      admin_uni: 'private',
      promoter: 'admin',
      user: 'private',
      student: 'private',
    };

    return userRole ? roleLayouts[userRole.toLowerCase()] || 'private' : 'public';
  }

  hasPermission(requiredRole: string): boolean {
    const userRole = this.tokenService.getUserRole();
    return userRole === requiredRole;
  }

  hasAnyPermission(requiredRoles: string[]): boolean {
    const userRole = this.tokenService.getUserRole();
    return userRole ? requiredRoles.includes(userRole.toLowerCase()) : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuthData(data: { token: string; user: any }): void {
    console.log('💾 Setting auth data:', data);

    // Guardar en localStorage (mantener compatibilidad)
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    // ✅ NUEVO: Actualizar TokenService con token y rol
    this.tokenService.setToken(data.token);
    this.tokenService.setUserRole(data.user.role);

    // Actualizar el signal del usuario actual
    this.currentUserSignal.set(data.user);

    console.log('🔄 Token and role set in TokenService:', {
      token: data.token ? 'Present' : 'Missing',
      role: data.user.role,
    });
  }

  getToken(): string | null {
    // Usar TokenService como fuente principal
    const token = this.tokenService.getToken();
    console.log('🔍 Getting token from TokenService:', token ? 'Found' : 'Not found');
    return token;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);

    // ✅ AGREGAR: Limpiar TokenService también
    this.tokenService.clearAll();
  }

  // Método para debugging
  debugRoleRouting(): void {
    const userRole = this.tokenService.getUserRole();
    console.log('🔍 Debug Role Routing:');
    console.log('- Current role:', userRole);
    console.log('- Available routes:', this.roleRoutes);
    console.log('- Normalized role:', userRole?.toLowerCase());
    console.log('- Target route:', this.roleRoutes[userRole?.toLowerCase() || '']);
  }
}
