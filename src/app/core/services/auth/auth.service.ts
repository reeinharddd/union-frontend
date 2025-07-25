import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
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
    const storedUser = localStorage.getItem('currentUser');

    console.log('🔄 Initializing from storage:', {
      hasToken: !!token,
      role: role || 'No role found',
      hasStoredUser: !!storedUser,
    });

    if (token && role && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.currentUserSignal.set(userData);
        console.log('✅ User initialized from storage:', userData);
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        this.clearAuthData();
      }
    } else {
      console.log('❌ Missing token, role, or stored user during initialization');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔄 AuthService - Attempting login with API');
    const backendCredentials = {
      correo: credentials.email,
      contrasena: credentials.password,
    };
    return this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, backendCredentials).pipe(
      tap(response => {
        console.log('✅ Login successful via API:', response);
        this.setAuthData(response);
        this.toastService.showSuccess(`¡Bienvenido ${response.user.name || response.user.email}!`);
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        this.toastService.showError('Error al iniciar sesión. Verifica tus credenciales.');
        return throwError(() => error);
      }),
    );
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
        console.error('❌ Registration failed:', error);
        this.toastService.showError('Error al crear la cuenta. Intenta nuevamente.');
        return throwError(() => error);
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
  // setAuthData(data: { token: string; user: any }): void {
  //   console.log('💾 Setting auth data:', data);

  //   // Guardar en localStorage (mantener compatibilidad)
  //   localStorage.setItem(this.TOKEN_KEY, data.token);
  //   localStorage.setItem('currentUser', JSON.stringify(data.user));

  //   // ✅ NUEVO: Actualizar TokenService con token y rol
  //   this.tokenService.setToken(data.token);
  //   this.tokenService.setUserRole(data.user.role);

  //   // Actualizar el signal del usuario actual
  //   this.currentUserSignal.set(data.user);

  //   console.log('🔄 Token and role set in TokenService:', {
  //     token: data.token ? 'Present' : 'Missing',
  //     role: data.user.role,
  //   });
  // }
  setAuthData(data: { token: string; user: any }): void {
    console.log('💾 Setting auth data:', data);

    // 🔥 AGREGAR: Mapeo de rol_id a role string
    const roleMapping: Record<number, string> = {
      1: 'admin',
      2: 'admin_uni',
      3: 'user',
      4: 'promoter',
    };

    // Convertir rol_id a role string
    const userRole = data.user.rol_id ? roleMapping[data.user.rol_id] || 'user' : 'user';

    // Guardar en localStorage (mantener compatibilidad)
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    // ✅ NUEVO: Actualizar TokenService con token y rol
    this.tokenService.setToken(data.token);
    this.tokenService.setUserRole(userRole);

    // Actualizar el signal del usuario actual
    this.currentUserSignal.set(data.user);

    console.log('🔄 Token and role set in TokenService:', {
      token: data.token ? 'Present' : 'Missing',
      role: userRole,
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
