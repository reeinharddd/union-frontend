import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
//import { Roles } from '../../enums/roles';
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
    1: '/student/dashboard',
    2: '/admin-uni/dashboard',
    3: '/admin/dashboard',
    4: '/promoter/dashboard',
    5: '/student/dashboard', // Rol 5 es administrador (compatibilidad con API)
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
        correo: '',
        rol_id: Number(role),
        nombre: '',
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
        this.toastService.showSuccess(`¡Bienvenido ${response.user.nombre || response.user.correo}!`);
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
    const userName = this.currentUser()?.nombre || 'Usuario';
    this.clearAuthData();
    this.toastService.showInfo(`¡Hasta luego ${userName}!`);
    this.router.navigate(['/login']);
  }

  navigateByRole(): void {
    const userRole = this.tokenService.getUserRole();
    console.log('🧭 Navigating by role:', userRole);
    console.log('🗺️ Available routes:', this.roleRoutes);

    if (userRole) {
      //const normalizedRole = userRole;
       const route = this.roleRoutes[userRole] || this.roleRoutes[userRole];

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

  getRoleLayout(role?: string | number): string {
    const userRole = role ?? this.tokenService.getUserRole();
    // Si es número, conviértelo a string
    const normalizedRole = String(userRole);
    // Si tienes layouts por número, agrégalos aquí si es necesario
    const roleLayouts: Record<string, string> = {
      '1': 'private', // estudiante
      '2': 'private', // admin-uni
      '3': 'admin',   // admin
      '4': 'admin',   // promoter
      '5': 'private', // admin (compatibilidad)
      admin: 'admin',
      admin_uni: 'private',
      promoter: 'admin',
      user: 'private',
      student: 'private',
    };
    return roleLayouts[normalizedRole] || 'public';
  }

  hasPermission(requiredRole: string | number): boolean {
    const userRole = this.tokenService.getUserRole();
    return String(userRole) === String(requiredRole);
  }

  hasAnyPermission(requiredRoles: (string | number)[]): boolean {
    const userRole = this.tokenService.getUserRole();
    return requiredRoles.map(String).includes(String(userRole));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuthData(data: { token: string; user: any }): void {
    console.log('💾 Setting auth data:', data);

    // Guardar en localStorage (mantener compatibilidad)
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    // ✅ NUEVO: Actualizar TokenService con token y rol
    this.tokenService.setToken(data.token);
    this.tokenService.setUserRole(data.user.rol_id);

    // Actualizar el signal del usuario actual
    this.currentUserSignal.set(data.user);

    console.log('🔄 Token and role set in TokenService:', {
      token: data.token ? 'Present' : 'Missing',
      role: data.user.rol_id,
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
