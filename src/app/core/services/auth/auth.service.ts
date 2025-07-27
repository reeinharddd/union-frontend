import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BaseService } from '../base/base.service';
import { TokenService } from './token.service';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/core/models/auth/auth.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  protected readonly serviceName = 'AuthService';
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  // Estado local
  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // Estado computado basado en el estado global
  readonly currentUser = computed(() => this.appState.currentUser());
  readonly userRole = computed(() => this.currentUser()?.rol_id);

  constructor() {
    super();
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const isAuthenticated = this.tokenService.isAuthenticated();

    if (isAuthenticated) {
      const user = this.tokenService.getStoredUser();
      if (user) {
        this.appState.setCurrentUser(user);
        this._isAuthenticated.set(true);
        console.log('🔄 Auth initialized from storage:', user);
      }
    } else {
      // Limpiar cualquier dato corrupto
      this.tokenService.clearSession();
      console.log('🔄 Auth initialization failed - session cleared');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.handleRequest(
      this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),
      'auth.login',
      {
        showSuccessToast: true,
        successMessage: `¡Bienvenido de vuelta!`,
        logRequest: true,
      },
    ).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.handleRequest(
      this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData),
      'auth.register',
      {
        showSuccessToast: true,
        successMessage: '¡Cuenta creada exitosamente!',
        logRequest: true,
      },
    ).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
    );
  }

  logout(): void {
    const userName = this.currentUser()?.nombre || 'Usuario';

    this.clearAuthData();
    this.router.navigate(['/login']);
    this.toastService.showInfo(`¡Hasta luego, ${userName}!`);

    console.log('🚪 User logged out successfully');
  }

  private setAuthData(authResponse: AuthResponse): void {
    // Guardar token
    this.tokenService.setToken(authResponse.token);
    this.tokenService.setStoredUser(authResponse.user);

    // Actualizar estados
    this.appState.setCurrentUser(authResponse.user);
    this._isAuthenticated.set(true);

    console.log('✅ Auth data set successfully:', {
      userId: authResponse.user.id,
      userName: authResponse.user.nombre,
      role: authResponse.user.rol_id,
    });
  }

  private clearAuthData(): void {
    this.tokenService.clearSession(); // Usar el nuevo método
    this.appState.clearCurrentUser();
    this._isAuthenticated.set(false);
    this.appState.clearErrors();

    console.log('🧹 Auth data cleared');
  }

  navigateByRole(): void {
    const role = this.userRole();
    const routes = {
      1: '/admin/dashboard',      // Admin
      2: '/student/dashboard',    // Estudiante
      3: '/promoter/dashboard',   // Profesor (como promoter)
      9: '/admin-uni/dashboard',  // Admin Universitario
    };

    const route = routes[role as keyof typeof routes] || '/student/dashboard';

    console.log('🧭 Navigating by role:', { role, route });
    this.router.navigate([route]);
  }
}
